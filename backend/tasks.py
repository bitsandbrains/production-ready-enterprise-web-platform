"""
Celery Tasks for Background PDF Processing
File: backend/tasks.py

Responsibilities:
- Execute background PDF extraction
- Delegate intelligence to PDFProcessor
- Generate Excel output
- Track task lifecycle in database

Aligned with:
- Hybrid Intelligence Layer (Regex + Gemini)
- Schema-validated output
- Windows-safe Celery execution
"""

from typing import List
from pathlib import Path
import logging

from celery import Celery

from backend.pdf_processor import PDFProcessor
from backend.excel_generator import ExcelGenerator
from backend.models import TaskStatus
from backend.database import update_task_status
from backend.config import REDIS_URL

logger = logging.getLogger(__name__)


# =====================================================
# Celery App Configuration
# =====================================================

celery_app = Celery(
    "pdf_contract_extractor",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)


# =====================================================
# Output Paths
# =====================================================

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "outputs"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# =====================================================
# Main Celery Task (NO AUTORETRY — DETERMINISTIC)
# =====================================================

@celery_app.task(
    bind=True,
    name="process_pdfs_task",
)
def process_pdfs_task(self, task_id: str, file_paths: List[str]) -> dict:
    """
    Process uploaded GeM contract PDFs and generate
    a single Excel file with 8 structured sheets.

    Guarantees:
    - One bad PDF does NOT fail the entire task
    - No infinite retries
    - Deterministic task lifecycle
    """

    try:
        # -------------------------------------------------
        # Input validation
        # -------------------------------------------------
        if not file_paths or not isinstance(file_paths, list):
            raise ValueError("file_paths must be a non-empty list")

        pdf_paths: List[Path] = []
        for fp in file_paths:
            path = Path(fp)
            if not path.exists():
                logger.warning("Skipping missing file: %s", fp)
                continue
            if path.suffix.lower() != ".pdf":
                logger.warning("Skipping non-PDF file: %s", fp)
                continue
            pdf_paths.append(path)

        if not pdf_paths:
            raise RuntimeError("No valid PDF files to process")

        total_files = len(pdf_paths)

        # -------------------------------------------------
        # Initialize components
        # -------------------------------------------------
        processor = PDFProcessor()
        excel_generator = ExcelGenerator()

        extracted_results: List[dict] = []
        failed_files: List[str] = []

        # -------------------------------------------------
        # Task started
        # -------------------------------------------------
        update_task_status(
            task_id=task_id,
            status=TaskStatus.PROCESSING,
            progress=5,
        )

        # -------------------------------------------------
        # PDF Processing Loop
        # -------------------------------------------------
        for index, pdf_path in enumerate(pdf_paths, start=1):
            try:
                logger.info(
                    "Processing PDF %s (%d/%d)",
                    pdf_path.name,
                    index,
                    total_files,
                )

                extracted_data = processor.process_pdf(pdf_path)

                if not extracted_data:
                    raise ValueError("Empty extraction result")

                extracted_results.append(extracted_data)

            except Exception:
                logger.exception(
                    "PDF processing failed: %s",
                    pdf_path.name,
                )
                failed_files.append(pdf_path.name)

            # Progress update (5 → 70)
            progress = 5 + int((index / total_files) * 65)
            update_task_status(
                task_id=task_id,
                status=TaskStatus.PROCESSING,
                progress=progress,
            )

        if not extracted_results:
            raise RuntimeError("All PDFs failed during extraction")

        # -------------------------------------------------
        # Excel Generation
        # -------------------------------------------------
        update_task_status(
            task_id=task_id,
            status=TaskStatus.PROCESSING,
            progress=80,
        )

        output_file = OUTPUT_DIR / f"{task_id}.xlsx"

        excel_generator.generate_excel(
            extracted_data=extracted_results,
            output_path=output_file,
        )

        # -------------------------------------------------
        # Task Completed
        # -------------------------------------------------
        update_task_status(
            task_id=task_id,
            status=TaskStatus.COMPLETED,
            progress=100,
            result={
                "file_name": output_file.name,
                "file_path": str(output_file),
                "processed_files": len(extracted_results),
                "failed_files": failed_files,
                "total_files": total_files,
            },
        )

        return {
            "task_id": task_id,
            "status": "completed",
            "processed_files": len(extracted_results),
            "failed_files": failed_files,
            "total_files": total_files,
        }

    except Exception as exc:
        logger.exception("Celery task failed")

        update_task_status(
            task_id=task_id,
            status=TaskStatus.FAILED,
            progress=0,
            error=str(exc),
        )

        # Do NOT retry at task level
        raise
