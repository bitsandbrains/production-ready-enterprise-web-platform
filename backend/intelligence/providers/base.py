"""
LLM Provider Base Interface
File: backend/intelligence/providers/base.py

Purpose:
- Define a strict, vendor-agnostic interface for all LLM providers
- Keep providers LOW-LEVEL and SCHEMA-AGNOSTIC
- Enforce a clean separation of concerns:
    Provider → raw text
    Client → prompt orchestration
    Validator → schema enforcement
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any


class BaseLLMProvider(ABC):
    """
    Abstract Base Class for all LLM providers (Gemini, OpenAI, etc.)

    IMPORTANT DESIGN RULE:
    - Providers return RAW TEXT ONLY
    - NO schema knowledge
    - NO JSON parsing
    - NO business logic
    """

    def __init__(
        self,
        model_name: str,
        temperature: float = 0.0,
        max_tokens: int = 4096,
    ) -> None:
        self.model_name = model_name
        self.temperature = temperature
        self.max_tokens = max_tokens

    # ---------------------------------------------------------
    # Core extraction contract (RAW TEXT ONLY)
    # ---------------------------------------------------------

    @abstractmethod
    def extract_structured_data(self, prompt: str) -> Optional[str]:
        """
        Execute an LLM call using the given prompt.

        MUST:
        - Send prompt exactly as received
        - Return raw text response
        - Return None on failure
        - NEVER parse JSON
        - NEVER guess or infer

        Args:
            prompt: Fully constructed prompt string

        Returns:
            Raw LLM text output or None
        """
        raise NotImplementedError

    # ---------------------------------------------------------
    # Optional helpers
    # ---------------------------------------------------------

    def supports_streaming(self) -> bool:
        return False

    def health_check(self) -> bool:
        return True

    def get_provider_metadata(self) -> Dict[str, Any]:
        return {
            "provider": self.__class__.__name__,
            "model": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }
