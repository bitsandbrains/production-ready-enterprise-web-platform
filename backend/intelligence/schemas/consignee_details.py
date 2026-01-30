"""
Pydantic Schema – Consignee Details
File: backend/intelligence/schemas/consignee_details.py

Represents Sheet 6 – Consignee Details

Guarantees:
- Exact Excel header alignment via aliases
- English-only string output
- Missing values are empty strings
- No inference, normalization, or correction
- No extra / unexpected fields
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class ConsigneeDetails(BaseModel):
    """
    Sheet 6 – Consignee Details
    """

    contact: str = Field(
        default="",
        alias="Contact",
        description="Contact number or details of the consignee",
    )

    email_id: str = Field(
        default="",
        alias="Email ID",
        description="Email ID of the consignee",
    )

    gstin: str = Field(
        default="",
        alias="GSTIN",
        description="GSTIN associated with the consignee",
    )

    address: str = Field(
        default="",
        alias="Address",
        description="Consignee address as mentioned in the contract",
    )

    service_description: str = Field(
        default="",
        alias="Service Description",
        description="Description of service or item delivered to the consignee",
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
        """
        if value is None:
            return ""
        return str(value).strip()
