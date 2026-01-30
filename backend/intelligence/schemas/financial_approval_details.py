"""
Pydantic Schema – Financial Approval Details
File: backend/intelligence/schemas/financial_approval_details.py

Represents Sheet 4 – Financial Approval Detail

Guarantees:
- Exact Excel header alignment via aliases
- English-only string output
- Missing values are empty strings
- No inference, correction, or hallucination
- No extra / unexpected fields
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class FinancialApprovalDetails(BaseModel):
    """
    Sheet 4 – Financial Approval Detail
    """

    ifd_concurrence: str = Field(
        default="",
        alias="IFD Concurrence",
        description="IFD concurrence status/details if mentioned",
    )

    designation_of_administrative_approval: str = Field(
        default="",
        alias="Designation of Administrative Approval",
        description="Designation providing administrative approval",
    )

    designation_of_financial_approval: str = Field(
        default="",
        alias="Designation of Financial Approval",
        description="Designation providing financial approval",
    )

    # ---------------------------------------------------------
    # Model configuration
    # ---------------------------------------------------------

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        validate_assignment=True,
        str_strip_whitespace=True,
    )

    # ---------------------------------------------------------
    # Validators (strictly defensive)
    # ---------------------------------------------------------

    @field_validator("*", mode="before")
    @classmethod
    def ensure_string(cls, value: Any) -> str:
        """
        Ensure every field is returned as a clean string.
        Convert None or non-string values to empty string safely.
        """
        if value is None:
            return ""
        return str(value).strip()
