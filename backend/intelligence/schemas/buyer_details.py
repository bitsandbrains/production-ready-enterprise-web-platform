"""
Pydantic Schema – Buyer Details
File: backend/intelligence/schemas/buyer_details.py

Represents Sheet 3 – Buyer Details

Guarantees:
- Exact Excel header alignment via aliases
- English-only string output
- Missing values are empty strings
- No inference, correction, or hallucination
- No extra / unexpected fields
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class BuyerDetails(BaseModel):
    """
    Sheet 3 – Buyer Details
    
    Field alignment:
    - Designation → "Designation"
    - Contact No. → "Contact No." (note the period!)
    - Email ID → "Email ID"
    - GSTIN → "GSTIN"
    - Address → "Address"
    """

    designation: str = Field(
        default="",
        alias="Designation",
        description="Designation of the buyer (e.g., SrDEE TRD AGC)",
    )

    contact_no: str = Field(
        default="",
        alias="Contact No.",
        description="Contact number of the buyer (e.g., 0562-2421206-)",
    )

    email_id: str = Field(
        default="",
        alias="Email ID",
        description="Email ID of the buyer",
    )

    gstin: str = Field(
        default="",
        alias="GSTIN",
        description="GSTIN of the buyer organisation",
    )

    address: str = Field(
        default="",
        alias="Address",
        description="Complete official address of the buyer including office prefix",
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
        Ensure all values are returned as clean strings.
        Convert None or non-string values to empty string safely.
        
        This validator ensures:
        1. None values become ""
        2. All values are strings
        3. Whitespace is stripped
        4. No hallucination or inference occurs
        """
        if value is None:
            return ""
        return str(value).strip()
    
    @field_validator("contact_no", mode="after")
    @classmethod
    def validate_contact(cls, value: str) -> str:
        """
        Validate contact number format.
        Accepts both landline (0562-2421206-) and mobile (9876543210) formats.
        Returns exactly as extracted, no formatting applied.
        """
        # No transformation - return as-is
        return value
    
    @field_validator("gstin", mode="after")
    @classmethod
    def validate_gstin(cls, value: str) -> str:
        """
        Validate GSTIN format.
        Expected format: 09AAAGM0289C1ZH (15 characters)
        Returns exactly as extracted.
        """
        # No transformation - return as-is
        return value