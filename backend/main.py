"""
FastAPI Backend for PDF Contract Data Extraction
File: backend/main.py

Responsibilities:
- Accept PDF uploads
- Validate inputs
- Create and track background tasks
- Trigger Celery extraction workflow
- Serve final Excel output

IMPORTANT:
- NO PDF parsing logic here
- NO intelligence logic here
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import List
from pathlib import Path
import uuid
import logging
from contextlib import asynccontextmanager

from backend.tasks import process_pdfs_task
from backend.models import TaskStatus, UploadResponse, StatusResponse
from backend.database import init_db, get_task_status, create_task, update_task_status
from backend.validators import validate_uploaded_files
from backend.storage import (
    save_uploaded_files,
    cleanup_task_files,
    get_output_file_path,
)
from backend.config import DEBUG

logger = logging.getLogger(__name__)


# =====================================================
# Lifespan (Startup / Shutdown)
# =====================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    logger.info("Application startup completed")
    yield
    logger.info("Application shutdown completed")


app = FastAPI(
    title="PDF Contract Extractor API",
    version="1.0.0",
    lifespan=lifespan,
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if DEBUG else [],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# Health Check
# =====================================================

@app.get("/")
async def root():
    return {
        "service": "PDF Contract Extractor API",
        "status": "running",
    }


# =====================================================
# Upload Endpoint
# =====================================================

@app.post("/api/upload", response_model=UploadResponse)
async def upload_pdfs(files: List[UploadFile] = File(...)):
    """
    Upload one or more textual GeM contract PDFs.
    """

    validate_uploaded_files(files)

    if len(files) > 20:
        raise HTTPException(
            status_code=400,
            detail="Maximum 20 PDF files allowed per upload",
        )

    task_id = str(uuid.uuid4())
    logger.info("Creating task %s for %d PDF(s)", task_id, len(files))

    # Create DB task FIRST
    create_task(task_id=task_id)

    try:
        saved_files = save_uploaded_files(files, task_id)
        file_paths = [str(p) for p in saved_files]
    except Exception as exc:
        logger.exception("File upload failed for task %s", task_id)
        cleanup_task_files(task_id)
        update_task_status(
            task_id=task_id,
            status=TaskStatus.FAILED,
            progress=0,
            error=str(exc),
        )
        raise HTTPException(
            status_code=500,
            detail="File upload failed",
        )

    # Dispatch Celery task
    try:
        process_pdfs_task.delay(task_id, file_paths)
    except Exception as exc:
        logger.exception("Celery dispatch failed for task %s", task_id)
        update_task_status(
            task_id=task_id,
            status=TaskStatus.FAILED,
            progress=0,
            error="Background task dispatch failed",
        )
        raise HTTPException(
            status_code=500,
            detail="Background processing unavailable",
        )

    return UploadResponse(
        task_id=task_id,
        message=f"{len(files)} PDF file(s) uploaded successfully",
        file_count=len(files),
    )


# =====================================================
# Status Endpoint
# =====================================================

@app.get("/api/status/{task_id}", response_model=StatusResponse)
async def get_status(task_id: str):
    task = get_task_status(task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Normalize enum
    task["status"] = TaskStatus(task["status"])

    return StatusResponse(**task)


# =====================================================
# Download Endpoint
# =====================================================

@app.get("/api/download/{task_id}")
async def download_excel(task_id: str):
    task = get_task_status(task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] != TaskStatus.COMPLETED.value:
        raise HTTPException(
            status_code=400,
            detail="Task is not completed yet",
        )

    file_path = get_output_file_path(task_id)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Output file not found",
        )

    return FileResponse(
        path=file_path,
        filename=f"contract_data_{task_id}.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


# =====================================================
# Cleanup Endpoint (Safe)
# =====================================================

@app.delete("/api/cleanup/{task_id}")
async def cleanup_task(task_id: str):
    task = get_task_status(task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task["status"] not in {
        TaskStatus.COMPLETED.value,
        TaskStatus.FAILED.value,
    }:
        raise HTTPException(
            status_code=400,
            detail="Cannot cleanup a running task",
        )

    cleanup_task_files(task_id)
    logger.info("Cleaned up task %s", task_id)

    return {"message": "Cleanup completed"}
