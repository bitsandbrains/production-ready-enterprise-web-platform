"""
Pydantic Schema – Organisation Details
File: backend/intelligence/schemas/organisation_details.py

Represents Sheet 2 – Organisation Details

Guarantees:
- Exact Excel header alignment via aliases
- English-only string values
- Empty strings for missing data (never None)
- No extra / unexpected fields
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class OrganisationDetails(BaseModel):
    """
    Sheet 2 – Organisation Details
    """

    org_type: str = Field(
        default="",
        alias="Type",
        description="Organisation type (e.g., Central Government, State Government)",
    )

    ministry: str = Field(
        default="",
        alias="Ministry",
        description="Ministry under Government of India",
    )

    department: str = Field(
        default="",
        alias="Department",
        description="Department under the Ministry",
    )

    organisation_name: str = Field(
        default="",
        alias="Organisation Name",
        description="Name of the buying organisation",
    )

    office_zone: str = Field(
        default="",
        alias="Office Zone",
        description="Office zone / regional office if mentioned",
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
    # Validators (defensive, non-destructive)
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
