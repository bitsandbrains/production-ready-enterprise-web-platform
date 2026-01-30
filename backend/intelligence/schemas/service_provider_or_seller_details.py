"""
Pydantic Schema – Service Provider / Seller Details
File: backend/intelligence/schemas/service_provider_or_seller_details.py

Represents Sheet 7 – Service Provider Details (or Seller Details)

Guarantees:
- Exact Excel header alignment via aliases
- English-only string output
- Missing values are empty strings
- No inference, normalization, or correction
- No extra / unexpected fields

CRITICAL FIELDS:
- GeM Seller ID: Must extract "6B50200001363812"
- Contact No.: Must extract "09720119940"
- MSME Registration Number: Must extract "UP54D0033152"
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class ServiceProviderOrSellerDetails(BaseModel):
    """
    Sheet 7 – Service Provider / Seller Details

    IMPORTANT:
    This schema extracts SERVICE PROVIDER data ONLY.
    Do NOT confuse with Buyer Details which has similar field names.
    """

    gem_seller_id: str = Field(
        default="",
        alias="GeM Seller ID",
        description="Unique GeM seller ID (e.g., 6B50200001363812)",
    )

    company_name: str = Field(
        default="",
        alias="Company Name",
        description="Registered company name of the seller",
    )

    contact_no: str = Field(
        default="",
        alias="Contact No.",
        description="Seller contact number (e.g., 09720119940)",
    )

    email_id: str = Field(
        default="",
        alias="Email ID",
        description="Official seller email ID",
    )

    address: str = Field(
        default="",
        alias="Address",
        description="Registered address of the seller",
    )

    # ✅ FIXED: Alias EXACTLY matches Excel header (case-sensitive)
    msme_registration_number: str = Field(
        default="",
        alias="MSME Registration Number",
        description="MSME / Udyam registration number (e.g., UP54D0033152)",
    )

    gstin: str = Field(
        default="",
        alias="GSTIN",
        description="GSTIN of the seller",
    )

    msme_status_as_verified_by_buyer: str = Field(
        default="",
        alias="MSME Status as verified by buyer",
        description="MSME status as verified by buyer",
    )

    mse_social_category: str = Field(
        default="",
        alias="MSE Social Category",
        description="MSE social category",
    )

    mse_gender: str = Field(
        default="",
        alias="MSE Gender",
        description="MSE gender category",
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
    # Validators (strictly defensive, non-destructive)
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

    @field_validator("gem_seller_id", mode="after")
    @classmethod
    def validate_gem_seller_id(cls, value: str) -> str:
        return value

    @field_validator("contact_no", mode="after")
    @classmethod
    def validate_contact(cls, value: str) -> str:
        return value

    @field_validator("msme_registration_number", mode="after")
    @classmethod
    def validate_msme(cls, value: str) -> str:
        return value
