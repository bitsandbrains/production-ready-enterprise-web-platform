"""
Gemini LLM Provider
File: backend/intelligence/providers/gemini.py

Purpose:
- Low-level Gemini SDK wrapper (google-genai)
- Accepts final prompt string
- Returns RAW JSON text ONLY
- NO schema awareness
- NO JSON parsing
- NO business logic
"""

import time
import logging
from typing import Optional

from google import genai
from google.genai import types

from backend.intelligence.providers.base import BaseLLMProvider
from backend.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL_NAME,
    LLM_TEMPERATURE,
    LLM_MAX_TOKENS,
    LLM_MAX_RETRIES,
    LLM_RETRY_BACKOFF_SEC,
)

logger = logging.getLogger("intelligence.gemini")
logger.setLevel(logging.INFO)


class GeminiProvider(BaseLLMProvider):
    """
    Thin Gemini SDK wrapper.
    """

    def __init__(self) -> None:
        if not GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY is not set")

        if not GEMINI_MODEL_NAME:
            raise RuntimeError("GEMINI_MODEL_NAME is not set")

        super().__init__(
            model_name=GEMINI_MODEL_NAME,
            temperature=LLM_TEMPERATURE,
            max_tokens=LLM_MAX_TOKENS,
        )

        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.max_retries = LLM_MAX_RETRIES
        self.retry_backoff_sec = LLM_RETRY_BACKOFF_SEC

    # ---------------------------------------------------------
    # REQUIRED ABSTRACT METHOD
    # ---------------------------------------------------------

    def extract_structured_data(self, prompt: str) -> Optional[str]:
        """
        Execute Gemini call and return RAW JSON text ONLY.
        """
        if not prompt or not prompt.strip():
            raise ValueError("Prompt must be a non-empty string")

        if len(prompt) > 100_000:
            logger.warning(
                "Large prompt detected (%d chars). Gemini may truncate output.",
                len(prompt),
            )

        return self._generate(prompt)

    # ---------------------------------------------------------
    # Internal Gemini call
    # ---------------------------------------------------------

    def _generate(self, prompt: str) -> Optional[str]:
        last_exception: Exception | None = None

        for attempt in range(1, self.max_retries + 2):
            try:
                logger.info(
                    "Gemini request | model=%s | attempt=%s",
                    self.model_name,
                    attempt,
                )

                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=self.temperature,
                        max_output_tokens=self.max_tokens,
                        response_mime_type="application/json",  # 🔥 CRITICAL FIX
                    ),
                )

                if not response or not response.text:
                    raise RuntimeError("Empty response from Gemini")

                text = response.text.strip()

                # Defensive cleanup: remove markdown fences if any
                if text.startswith("```"):
                    text = text.strip("`").strip()

                return text

            except Exception as exc:
                last_exception = exc
                logger.warning(
                    "Gemini call failed (%s/%s): %s",
                    attempt,
                    self.max_retries + 1,
                    str(exc),
                )

                if attempt <= self.max_retries:
                    time.sleep(self.retry_backoff_sec * attempt)

        logger.error(
            "Gemini failed after %s attempts: %s",
            self.max_retries + 1,
            last_exception,
        )
        return None

    # ---------------------------------------------------------
    # Optional health check
    # ---------------------------------------------------------

    def health_check(self) -> bool:
        """
        Lightweight connectivity check.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents="{}",
                config=types.GenerateContentConfig(
                    temperature=0.0,
                    max_output_tokens=10,
                    response_mime_type="application/json",
                ),
            )
            return bool(response and response.text)
        except Exception:
            return False
