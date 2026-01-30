"""
LLM Client
File: backend/intelligence/llm_client.py

Purpose:
- Build a single extraction prompt
- Call LLM provider once per PDF
- Return RAW JSON text only
- Keep intelligence layer LLM-agnostic
"""

import logging
import time
from typing import Optional

from backend.intelligence.prompts.v2_enhanced import build_prompt
from backend.intelligence.providers.gemini import GeminiProvider

logger = logging.getLogger("intelligence.llm_client")
logger.setLevel(logging.INFO)


class LLMClient:
    """
    Unified LLM client used by the intelligence layer.
    """

    def __init__(
        self,
        max_retries: int = 2,
        retry_delay_sec: float = 1.5,
    ) -> None:
        self.max_retries = max_retries
        self.retry_delay_sec = retry_delay_sec

        # Low-level provider (Gemini)
        self._provider = GeminiProvider()

    # ---------------------------------------------------------
    # Public API (SINGLE CALL – AUDIT SAFE)
    # ---------------------------------------------------------

    def extract_structured_data(
        self,
        pdf_text: str,
    ) -> Optional[str]:
        """
        Extract ALL structured data in a single LLM call.

        Args:
            pdf_text: Cleaned PDF text

        Returns:
            Raw JSON string or None
        """

        if not pdf_text or not pdf_text.strip():
            logger.error("Empty PDF text provided to LLMClient")
            return None

        prompt = build_prompt(pdf_text)

        logger.info(
            "LLM prompt built | characters=%d",
            len(prompt),
        )

        attempt = 0

        while attempt <= self.max_retries:
            attempt += 1

            try:
                logger.info("LLM extraction attempt %d", attempt)

                raw_text = self._provider.extract_structured_data(
                    prompt=prompt
                )

                if not raw_text or not raw_text.strip():
                    raise RuntimeError("Empty LLM response")

                return raw_text.strip()

            except (TimeoutError, ConnectionError) as exc:
                # Retryable failures only
                logger.warning(
                    "Transient LLM failure (attempt %d): %s",
                    attempt,
                    exc,
                )

                if attempt <= self.max_retries:
                    time.sleep(self.retry_delay_sec)

            except Exception as exc:
                # Deterministic failure – DO NOT retry
                logger.error(
                    "Non-retryable LLM failure: %s",
                    exc,
                    exc_info=True,
                )
                break

        logger.error("LLM extraction failed after all allowed attempts")
        return None
