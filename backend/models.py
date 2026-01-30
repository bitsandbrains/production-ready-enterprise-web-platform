"""
Core Models, Enums, and API Schemas
File: backend/models.py

Defines:
- Task lifecycle states
- Strongly-typed API request/response schemas

IMPORTANT:
This module contains NO extraction logic.
PDF parsing and intelligence live elsewhere.
"""

from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


# =====================================================
# Task Status Enum
# =====================================================

class TaskStatus(str, Enum):
    """
    Lifecycle states of a background processing task.
    """
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


# =====================================================
# API Response Schemas
# =====================================================

class UploadResponse(BaseModel):
    """
    Response returned after successful PDF upload.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    task_id: str = Field(
        ...,
        description="Unique background task identifier",
    )

    message: str = Field(
        ...,
        description="Upload acknowledgement message",
    )

    file_count: int = Field(
        ...,
        gt=0,
        description="Number of uploaded PDF files",
    )


class StatusResponse(BaseModel):
    """
    Response returned when polling background task status.
    """

    model_config = ConfigDict(
        extra="forbid",
        use_enum_values=True,
    )

    task_id: str = Field(
        ...,
        description="Task identifier",
    )

    status: TaskStatus = Field(
        ...,
        description="Current task status",
    )

    progress: int = Field(
        ...,
        ge=0,
        le=100,
        description="Task completion percentage (0–100)",
    )

    result: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Result metadata (Excel file info) if task completed",
    )

    error: Optional[str] = Field(
        default=None,
        description="Error message if task failed",
    )

    created_at: datetime = Field(
        ...,
        description="Task creation timestamp",
    )

    updated_at: datetime = Field(
        ...,
        description="Last task update timestamp",
    )
