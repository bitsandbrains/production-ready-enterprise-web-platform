"""
Metrics & Observability
File: backend/intelligence/metrics.py

Purpose:
- Measure extraction quality (coverage & completeness)
- Track fallback vs LLM usage
- Track latency per stage
- Provide audit-ready signals without modifying data

Design principles:
- Read-only observability (no mutation of extracted data)
- Zero PII leakage in logs
- Safe for production and Windows environments
"""

from dataclasses import dataclass
from typing import Dict, Any, Optional
from time import perf_counter
import json
import logging


logger = logging.getLogger("intelligence.metrics")
logger.setLevel(logging.INFO)


# ---------------------------------------------------------
# Timing utilities
# ---------------------------------------------------------

class Timer:
    """Lightweight context timer."""

    def __init__(self) -> None:
        self.start: Optional[float] = None
        self.end: Optional[float] = None

    def __enter__(self):
        self.start = perf_counter()
        return self

    def __exit__(self, exc_type, exc, tb):
        self.end = perf_counter()

    @property
    def elapsed_ms(self) -> float:
        if self.start is None or self.end is None:
            return 0.0
        return round((self.end - self.start) * 1000, 2)


# ---------------------------------------------------------
# Metrics data model
# ---------------------------------------------------------

@dataclass
class ExtractionMetrics:
    """
    Container for a single PDF extraction run.
    """

    # Timing
    regex_time_ms: float = 0.0
    llm_time_ms: float = 0.0
    validation_time_ms: float = 0.0
    total_time_ms: float = 0.0

    # Coverage
    total_sections: int = 8
    sections_with_data: int = 0

    # Field-level completeness
    total_fields: int = 0
    filled_fields: int = 0

    # Source attribution
    regex_filled_fields: int = 0
    llm_filled_fields: int = 0

    # Diagnostics
    used_llm: bool = False
    used_regex: bool = False
    validation_errors: int = 0

    # Metadata (non-PII)
    pdf_pages: Optional[int] = None

    @property
    def completeness_ratio(self) -> float:
        if self.total_fields == 0:
            return 0.0
        return round(self.filled_fields / self.total_fields, 4)

    @property
    def section_coverage_ratio(self) -> float:
        if self.total_sections == 0:
            return 0.0
        return round(self.sections_with_data / self.total_sections, 4)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "timing_ms": {
                "regex": self.regex_time_ms,
                "llm": self.llm_time_ms,
                "validation": self.validation_time_ms,
                "total": self.total_time_ms,
            },
            "coverage": {
                "sections_with_data": self.sections_with_data,
                "total_sections": self.total_sections,
                "section_coverage_ratio": self.section_coverage_ratio,
            },
            "fields": {
                "filled": self.filled_fields,
                "total": self.total_fields,
                "completeness_ratio": self.completeness_ratio,
            },
            "sources": {
                "regex_filled_fields": self.regex_filled_fields,
                "llm_filled_fields": self.llm_filled_fields,
                "used_llm": self.used_llm,
                "used_regex": self.used_regex,
            },
            "diagnostics": {
                "validation_errors": self.validation_errors,
                "pdf_pages": self.pdf_pages,
            },
        }


# ---------------------------------------------------------
# Metrics collector
# ---------------------------------------------------------

class MetricsCollector:
    """
    Collects and emits metrics for a single extraction run.
    """

    def __init__(self, pdf_pages: Optional[int] = None) -> None:
        self.metrics = ExtractionMetrics(pdf_pages=pdf_pages)
        self._total_timer = perf_counter()

    # -----------------------------
    # Timing hooks
    # -----------------------------

    def record_regex_time(self, ms: float):
        self.metrics.regex_time_ms = ms
        self.metrics.used_regex = ms > 0

    def record_llm_time(self, ms: float):
        self.metrics.llm_time_ms = ms
        self.metrics.used_llm = ms > 0

    def record_validation_time(self, ms: float):
        self.metrics.validation_time_ms = ms

    def finalize(self):
        self.metrics.total_time_ms = round(
            (perf_counter() - self._total_timer) * 1000, 2
        )

    # -----------------------------
    # Content analysis
    # -----------------------------

    def analyze_output(
        self,
        validated_output: Dict[str, Dict[str, str]],
        regex_output: Dict[str, Dict[str, Any]],
        llm_output: Dict[str, Dict[str, Any]],
        validation_errors: int = 0,
    ):
        """
        Analyze field-level completeness and attribution.
        """

        # Reset counters (critical for correctness)
        self.metrics.sections_with_data = 0
        self.metrics.total_fields = 0
        self.metrics.filled_fields = 0
        self.metrics.regex_filled_fields = 0
        self.metrics.llm_filled_fields = 0
        self.metrics.validation_errors = validation_errors

        for section, fields in validated_output.items():
            if any(v.strip() for v in fields.values()):
                self.metrics.sections_with_data += 1

            for field, value in fields.items():
                self.metrics.total_fields += 1

                if not value.strip():
                    continue

                self.metrics.filled_fields += 1

                # Attribution must follow FINAL value
                if llm_output.get(section, {}).get(field):
                    self.metrics.llm_filled_fields += 1
                elif regex_output.get(section, {}).get(field):
                    self.metrics.regex_filled_fields += 1

    # -----------------------------
    # Emission
    # -----------------------------

    def emit(self):
        """
        Emit metrics to logs (JSON, structured).
        Safe for production logging / APM ingestion.
        """
        payload = self.metrics.to_dict()
        logger.info(
            "EXTRACTION_METRICS %s",
            json.dumps(payload, ensure_ascii=False),
        )
        return payload
