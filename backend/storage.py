"""
Storage Utilities
Handles file storage for uploaded PDFs and generated Excel outputs
File: backend/storage.py

Responsibilities:
- Persist uploaded PDF files safely
- Resolve output Excel file paths
- Cleanup task-related files

IMPORTANT:
This module is the SINGLE SOURCE OF TRUTH for filesystem paths.
Other modules MUST NOT hardcode upload/output directories.
"""

from pathlib import Path
from typing import List
import shutil
import uuid
import logging

from fastapi import UploadFile

logger = logging.getLogger(__name__)


# =====================================================
# Storage root (aligned with backend/)
# =====================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# =====================================================
# Upload handling
# =====================================================

def create_task_upload_dir(task_id: str) -> Path:
    """
    Create and return a directory for a task's uploaded PDF files.
    """
    if not task_id:
        raise ValueError("task_id cannot be empty")

    task_dir = UPLOAD_DIR / task_id
    task_dir.mkdir(parents=True, exist_ok=True)
    return task_dir


def save_uploaded_files(
    files: List[UploadFile],
    task_id: str,
) -> List[Path]:
    """
    Save uploaded PDF files to disk safely and return their paths.

    Guarantees:
    - PDF-only storage
    - Unique filenames (no overwrite risk)
    - Deterministic paths for Celery workers
    - Proper file descriptor cleanup (Windows-safe)
    """
    task_dir = create_task_upload_dir(task_id)
    saved_files: List[Path] = []

    for file in files:
        if not file.filename:
            raise ValueError("Uploaded file has no filename")

        if not file.filename.lower().endswith(".pdf"):
            raise ValueError(
                f"Invalid file type (PDF required): {file.filename}"
            )

        # Prevent path traversal / unsafe filenames
        original_name = Path(file.filename).name
        safe_name = f"{uuid.uuid4()}_{original_name}"
        file_path = task_dir / safe_name

        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as exc:
            logger.exception("Failed to save uploaded file: %s", file_path)
            raise RuntimeError(
                f"Failed to save uploaded file: {original_name}"
            ) from exc
        finally:
            try:
                file.file.close()
            except Exception:
                pass

        saved_files.append(file_path)

    if not saved_files:
        raise RuntimeError("No files were saved to disk")

    logger.info(
        "Saved %d PDF file(s) for task %s",
        len(saved_files),
        task_id,
    )

    return saved_files


# =====================================================
# Output handling
# =====================================================

def get_output_file_path(task_id: str) -> Path:
    """
    Return the Excel output file path for a task.
    """
    if not task_id:
        raise ValueError("task_id cannot be empty")

    return OUTPUT_DIR / f"{task_id}.xlsx"


# =====================================================
# Cleanup utilities
# =====================================================

def cleanup_task_files(task_id: str) -> None:
    """
    Remove uploaded PDFs and generated Excel for a task.
    Safe, idempotent, and production-ready.
    """
    if not task_id:
        return

    logger.info("Cleaning up files for task %s", task_id)

    upload_path = UPLOAD_DIR / task_id
    output_file = get_output_file_path(task_id)

    try:
        if upload_path.exists():
            shutil.rmtree(upload_path)
    except Exception:
        logger.exception("Failed to cleanup upload directory: %s", upload_path)

    try:
        if output_file.exists():
            output_file.unlink()
    except Exception:
        logger.exception("Failed to cleanup output file: %s", output_file)
