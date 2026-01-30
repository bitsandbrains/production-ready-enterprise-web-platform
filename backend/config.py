"""
Application Configuration Module
File: backend/config.py

Responsibilities:
- Load environment variables
- Provide validated configuration for:
  - Database
  - Redis / Celery
  - API server
  - Intelligence / LLM layer (Gemini via google-genai)
  - Runtime environment

IMPORTANT:
- No business logic
- No PDF parsing
- No LLM calls
"""

from pathlib import Path
import os
from dotenv import load_dotenv


# =====================================================
# Environment Loading
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

load_dotenv(dotenv_path=ENV_FILE, override=False)


# =====================================================
# Environment Type
# =====================================================

ENV = os.getenv("ENV", "development").strip().lower()

if ENV not in {"development", "staging", "production"}:
    raise RuntimeError(
        f"Invalid ENV value '{ENV}'. "
        "Must be one of: development, staging, production."
    )


# =====================================================
# Database Configuration
# =====================================================

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. "
        "The application cannot start without a database."
    )


# =====================================================
# Redis / Celery Configuration
# =====================================================

REDIS_URL = os.getenv("REDIS_URL")

if not REDIS_URL:
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = os.getenv("REDIS_PORT", "6379")
    REDIS_DB = os.getenv("REDIS_DB", "0")
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")

    if REDIS_PASSWORD:
        REDIS_URL = (
            f"redis://:{REDIS_PASSWORD}@{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"
        )
    else:
        REDIS_URL = f"redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}"


# =====================================================
# API Server Configuration
# =====================================================

API_HOST = os.getenv("API_HOST", "0.0.0.0")

try:
    API_PORT = int(os.getenv("API_PORT", "8000"))
except ValueError as exc:
    raise RuntimeError("API_PORT must be a valid integer") from exc


# =====================================================
# Intelligence / Extraction Configuration
# =====================================================

ENABLE_INTELLIGENCE = (
    os.getenv("ENABLE_INTELLIGENCE", "true").strip().lower() == "true"
)

INTELLIGENCE_MODE = os.getenv(
    "INTELLIGENCE_MODE", "hybrid"
).strip().lower()

if INTELLIGENCE_MODE not in {"regex", "llm", "hybrid"}:
    raise RuntimeError(
        "INTELLIGENCE_MODE must be one of: regex, llm, hybrid"
    )

if not ENABLE_INTELLIGENCE:
    INTELLIGENCE_MODE = "regex"


# =====================================================
# Gemini (google-genai) Configuration
# =====================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

GEMINI_MODEL_NAME = os.getenv(
    "GEMINI_MODEL_NAME",
    "gemini-1.5-flash",  # stable, fast, extraction-friendly
)

if ENABLE_INTELLIGENCE and INTELLIGENCE_MODE in {"llm", "hybrid"}:
    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is required when intelligence mode uses LLM."
        )
    if not GEMINI_MODEL_NAME:
        raise RuntimeError(
            "GEMINI_MODEL_NAME is required when intelligence mode uses LLM."
        )


# =====================================================
# LLM Runtime Safety Limits
# =====================================================

try:
    LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", "0.0"))
except ValueError as exc:
    raise RuntimeError("LLM_TEMPERATURE must be a float") from exc

if not (0.0 <= LLM_TEMPERATURE <= 1.0):
    raise RuntimeError("LLM_TEMPERATURE must be between 0.0 and 1.0")

try:
    LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "4096"))
    LLM_MAX_RETRIES = int(os.getenv("LLM_MAX_RETRIES", "3"))
    LLM_RETRY_BACKOFF_SEC = int(os.getenv("LLM_RETRY_BACKOFF_SEC", "2"))
except ValueError as exc:
    raise RuntimeError(
        "LLM_MAX_TOKENS, LLM_MAX_RETRIES, and "
        "LLM_RETRY_BACKOFF_SEC must be integers"
    ) from exc

if LLM_MAX_TOKENS <= 0:
    raise RuntimeError("LLM_MAX_TOKENS must be > 0")

if LLM_MAX_RETRIES < 0:
    raise RuntimeError("LLM_MAX_RETRIES must be >= 0")

if LLM_RETRY_BACKOFF_SEC < 0:
    raise RuntimeError("LLM_RETRY_BACKOFF_SEC must be >= 0")


# =====================================================
# Runtime Flags
# =====================================================

DEBUG = ENV == "development"
