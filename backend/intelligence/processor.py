"""
Intelligence Processor (Hybrid Extraction Orchestrator)
File: backend/intelligence/processor.py

AUDIT-SAFE, ZERO-INFERENCE PIPELINE
"""

from typing import Dict, Any
import json
import logging
import re

from backend.intelligence.providers.fallback_regex import RegexFallbackProvider
from backend.intelligence.llm_client import LLMClient
from backend.intelligence.response_validator import ResponseValidator
from backend.intelligence.metrics import MetricsCollector, Timer

logger = logging.getLogger("intelligence.processor")
logger.setLevel(logging.INFO)


class IntelligenceProcessor:
    """
    Hybrid extraction orchestrator.

    HARD GUARANTEES:
    - Regex output is authoritative
    - LLM NEVER overwrites non-empty or NA values
    - NA is preserved exactly
    - No cross-section contamination
    - No hallucination allowed
    """

    def __init__(self) -> None:
        self.regex_provider = RegexFallbackProvider()
        self.llm_client = LLMClient()
        self.validator = ResponseValidator()

    # ---------------------------------------------------------
    # Public API
    # ---------------------------------------------------------

    def process(self, pdf_text: str) -> Dict[str, Dict[str, str]]:
        if not pdf_text or not pdf_text.strip():
            logger.error("Empty PDF text received")
            return self.validator.validate({})

        metrics = MetricsCollector()

        # -----------------------------
        # Step 1: Regex (AUTHORITATIVE)
        # -----------------------------
        with Timer() as t:
            regex_result = self.regex_provider.extract(pdf_text)
        metrics.record_regex_time(t.elapsed_ms)

        # -----------------------------
        # Step 2: LLM (OPTIONAL)
        # -----------------------------
        llm_result: Dict[str, Dict[str, Any]] = {}

        with Timer() as t:
            raw_llm_text = self.llm_client.extract_structured_data(
                pdf_text=pdf_text
            )
        metrics.record_llm_time(t.elapsed_ms)

        if raw_llm_text:
            parsed = self._safe_parse_llm_json(raw_llm_text)
            if isinstance(parsed, dict):
                llm_result = parsed
            else:
                logger.warning("LLM output ignored (invalid JSON)")

        # -----------------------------
        # Step 3: STRICT MERGE
        # -----------------------------
        merged = self._merge_results(
            regex_result=regex_result,
            llm_result=llm_result,
        )

        # -----------------------------
        # Step 4: FINAL VALIDATION
        # -----------------------------
        with Timer() as t:
            validated = self.validator.validate(merged)
        metrics.record_validation_time(t.elapsed_ms)

        # -----------------------------
        # Step 5: Metrics
        # -----------------------------
        metrics.analyze_output(
            validated_output=validated,
            regex_output=regex_result,
            llm_output=llm_result,
        )
        metrics.finalize()
        metrics.emit()

        return validated

    # ---------------------------------------------------------
    # Internal helpers
    # ---------------------------------------------------------

    @staticmethod
    def _safe_parse_llm_json(raw_text: str) -> Any:
        """
        Extract JSON safely from LLM output.
        """

        fenced = re.search(
            r"```(?:json)?\s*(\{.*?\})\s*```",
            raw_text,
            re.DOTALL | re.IGNORECASE,
        )
        candidate = fenced.group(1) if fenced else raw_text

        try:
            return json.loads(candidate)
        except Exception:
            pass

        brace = re.search(r"(\{.*\})", raw_text, re.DOTALL)
        if brace:
            try:
                return json.loads(brace.group(1))
            except Exception:
                pass

        return None

    @staticmethod
    def _is_corrupted_llm_value(value: str) -> bool:
        """
        Detect LLM hallucination artifacts.
        """
        if not value:
            return True

        # repeated characters like qquuaarrtteerrllyy
        if re.search(r"(.)\1{3,}", value):
            return True

        return False

    @staticmethod
    def _merge_results(
        regex_result: Dict[str, Dict[str, Any]],
        llm_result: Dict[str, Dict[str, Any]],
    ) -> Dict[str, Dict[str, Any]]:
        """
        STRICT MERGE RULES:

        1. Regex always wins
        2. NA is preserved
        3. LLM fills ONLY when regex field is empty
        4. Corrupted LLM values are dropped
        5. Section keys are NOT mixed
        """

        merged: Dict[str, Dict[str, Any]] = {}

        for section, regex_section in regex_result.items():
            merged[section] = {}
            llm_section = llm_result.get(section, {}) or {}

            for field, regex_value in regex_section.items():

                # Preserve NA exactly
                if isinstance(regex_value, str) and regex_value.strip().upper() == "NA":
                    merged[section][field] = "NA"
                    continue

                # Preserve non-empty regex
                if isinstance(regex_value, str) and regex_value.strip():
                    merged[section][field] = regex_value.strip()
                    continue

                # Only then allow LLM
                llm_value = llm_section.get(field)

                if (
                    isinstance(llm_value, str)
                    and llm_value.strip()
                    and not IntelligenceProcessor._is_corrupted_llm_value(llm_value)
                ):
                    merged[section][field] = llm_value.strip()
                else:
                    merged[section][field] = ""

        return merged
