"""
Pydantic Schema – Paying Authority Details
File: backend/intelligence/schemas/paying_authority_details.py

Represents Sheet 5 – Paying Authority Details

Guarantees:
- Exact Excel header alignment via aliases
- English-only string output
- Missing values are empty strings
- No inference, correction, or hallucination
- No extra / unexpected fields
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class PayingAuthorityDetails(BaseModel):
    """
    Sheet 5 – Paying Authority Details
    """

    role: str = Field(
        default="",
        alias="Role",
        description="Role of the paying authority",
    )

    payment_mode: str = Field(
        default="",
        alias="Payment Mode",
        description="Mode of payment if specified",
    )

    designation: str = Field(
        default="",
        alias="Designation",
        description="Designation of the paying authority officer",
    )

    email_id: str = Field(
        default="",
        alias="Email ID",
        description="Official email ID of the paying authority",
    )

    gstin: str = Field(
        default="",
        alias="GSTIN",
        description="GSTIN associated with the paying authority",
    )

    address: str = Field(
        default="",
        alias="Address",
        description="Official address of the paying authority",
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
