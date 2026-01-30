"""
Database Module - PostgreSQL operations (Supabase compatible)
File: backend/database.py

Responsibilities:
- Manage database connections safely
- Persist task lifecycle state
- Support async / Celery workflows reliably

IMPORTANT:
- NO PDF extraction logic
- NO intelligence / LLM logic
"""

from contextlib import contextmanager
from typing import Optional, Dict, Any, List

import psycopg2
from psycopg2.extras import RealDictCursor, Json

from backend.config import DATABASE_URL
from backend.models import TaskStatus


# =====================================================
# Database connection helper
# =====================================================

@contextmanager
def get_db_connection():
    """
    Create a PostgreSQL connection using Supabase Session Pooler.

    Guarantees:
    - SSL enforced
    - Explicit transaction handling
    - Safe rollback on failure
    """
    conn = psycopg2.connect(
        DATABASE_URL,
        connect_timeout=10,
        application_name="gem_pdf_contract_extractor",
    )
    conn.autocommit = False

    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


# =====================================================
# Schema initialization
# =====================================================

def init_db() -> None:
    """
    Initialize database schema (idempotent).
    Safe to run on every FastAPI startup.
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    task_id VARCHAR(255) PRIMARY KEY,
                    status VARCHAR(50) NOT NULL,
                    progress INTEGER NOT NULL DEFAULT 0,
                    result JSONB,
                    error TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    CHECK (progress >= 0 AND progress <= 100)
                )
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_tasks_status
                ON tasks(status)
            """)

            cursor.execute("""
                CREATE INDEX IF NOT EXISTS idx_tasks_created_at
                ON tasks(created_at DESC)
            """)


# =====================================================
# Task lifecycle functions
# =====================================================

def create_task(task_id: str) -> None:
    """
    Create or reset a task record.

    Guarantees:
    - Idempotent
    - Safe for retries and re-uploads
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO tasks (task_id, status, progress, result, error)
                VALUES (%s, %s, %s, NULL, NULL)
                ON CONFLICT (task_id) DO UPDATE
                SET status = EXCLUDED.status,
                    progress = EXCLUDED.progress,
                    result = NULL,
                    error = NULL,
                    updated_at = CURRENT_TIMESTAMP
            """, (
                task_id,
                TaskStatus.PENDING.value,
                0,
            ))


def update_task_status(
    task_id: str,
    status: TaskStatus,
    progress: int,
    result: Optional[Dict[str, Any]] = None,
    error: Optional[str] = None,
) -> None:
    """
    Update status of an existing task.

    Guarantees:
    - Atomic update
    - Safe for Celery retries
    - Correct error lifecycle
    """

    if not isinstance(status, TaskStatus):
        raise TypeError("status must be a TaskStatus enum")

    if not (0 <= progress <= 100):
        raise ValueError("progress must be between 0 and 100")

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE tasks
                SET status = %s,
                    progress = %s,
                    result = COALESCE(%s, result),
                    error = %s,
                    updated_at = CURRENT_TIMESTAMP
                WHERE task_id = %s
            """, (
                status.value,
                progress,
                Json(result) if result is not None else None,
                error,
                task_id,
            ))


def get_task_status(task_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve task status by task_id.
    Returns None if task not found.
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT task_id,
                       status,
                       progress,
                       result,
                       error,
                       created_at,
                       updated_at
                FROM tasks
                WHERE task_id = %s
            """, (task_id,))
            row = cursor.fetchone()
            return dict(row) if row else None


def get_recent_tasks(limit: int = 50) -> List[Dict[str, Any]]:
    """
    Retrieve recent tasks (dashboard / admin use).
    """
    if limit <= 0:
        raise ValueError("limit must be positive")

    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT task_id,
                       status,
                       progress,
                       created_at,
                       updated_at
                FROM tasks
                ORDER BY created_at DESC
                LIMIT %s
            """, (limit,))
            return [dict(row) for row in cursor.fetchall()]


def delete_old_tasks(days: int = 7) -> int:
    """
    Delete tasks older than N days.
    Returns number of deleted rows.
    """
    if days <= 0:
        raise ValueError("days must be a positive integer")

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""
                DELETE FROM tasks
                WHERE created_at < CURRENT_TIMESTAMP - (%s * INTERVAL '1 day')
            """, (days,))
            return cursor.rowcount
