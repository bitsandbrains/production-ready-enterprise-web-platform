"""
Validation Utilities
Validates uploaded PDF files before extraction
File: backend/validators.py

Purpose:
- Reject invalid, non-extractable PDFs early
- Guarantee PDFs are textual (not scanned)
- Enforce size and type limits
- Improve downstream extraction accuracy

NOTE:
This module DOES NOT extract data.
It ensures only extractable PDFs reach pdf_processor.py.
"""

from fastapi import UploadFile, HTTPException
from typing import List
import pdfplumber
import re
import logging


logger = logging.getLogger(__name__)


# =====================================================
# Configuration
# =====================================================

ALLOWED_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

MIN_TEXT_LENGTH = 300          # Minimum characters to consider PDF textual
MIN_ENGLISH_RATIO = 0.4        # Lenient for mixed Hindi/English GeM PDFs
MAX_PAGES_TO_SCAN = 3          # Performance guard


# =====================================================
# Public API
# =====================================================

def validate_uploaded_files(files: List[UploadFile]) -> None:
    """
    Validate uploaded PDF files before processing.

    Guarantees:
    - At least one file
    - Only PDF files
    - File size within limit
    - PDF is textual (not scanned)
    - PDF contains sufficient English content
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    for file in files:
        _validate_filename(file)
        _validate_extension(file.filename)
        _validate_file_size(file)
        _validate_pdf_content(file)


# =====================================================
# Internal helpers
# =====================================================

def _validate_filename(file: UploadFile) -> None:
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid file name",
        )


def _validate_extension(filename: str) -> None:
    if not filename.lower().endswith(tuple(ALLOWED_EXTENSIONS)):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {filename}. Only PDF files are allowed.",
        )


def _validate_file_size(file: UploadFile) -> None:
    """
    Safely check file size without consuming the stream.
    """
    file_obj = file.file
    current_position = file_obj.tell()

    file_obj.seek(0, 2)  # SEEK_END
    size = file_obj.tell()
    file_obj.seek(current_position)

    if size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=(
                f"File too large: {file.filename}. "
                f"Max allowed size is {MAX_FILE_SIZE_MB}MB."
            ),
        )


def _validate_pdf_content(file: UploadFile) -> None:
    """
    Single-pass validation:
    - Ensures PDF is textual
    - Ensures sufficient English content
    """

    file.file.seek(0)

    try:
        with pdfplumber.open(file.file) as pdf:
            extracted_text_parts = []

            for page in pdf.pages[:MAX_PAGES_TO_SCAN]:
                page_text = page.extract_text()
                if page_text:
                    extracted_text_parts.append(page_text)

        text = "\n".join(extracted_text_parts).strip()

        # ------------------------------
        # Textual PDF check
        # ------------------------------
        if len(text) < MIN_TEXT_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"PDF appears to be scanned or non-textual: {file.filename}. "
                    "Only textual PDFs are supported."
                ),
            )

        # ------------------------------
        # English content heuristic
        # ------------------------------
        sample = re.sub(r"[\d\s]", "", text)

        if not sample:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"PDF does not contain readable text: {file.filename}."
                ),
            )

        ascii_chars = sum(1 for c in sample if ord(c) < 128)
        ratio = ascii_chars / len(sample)

        if ratio < MIN_ENGLISH_RATIO:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"PDF does not contain sufficient English text: {file.filename}. "
                    "Only English-dominant GeM PDFs are supported."
                ),
            )

    except HTTPException:
        raise

    except Exception as exc:
        logger.exception("PDF validation failed for file: %s", file.filename)
        raise HTTPException(
            status_code=400,
            detail=f"Unable to read or validate PDF file: {file.filename}",
        ) from exc

    finally:
        # Restore stream pointer for downstream processing
        file.file.seek(0)
