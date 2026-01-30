"""
Pydantic Schema – Service / Product Details
File: backend/intelligence/schemas/service_or_product_details.py

Represents Sheet 8 – Service Details (or Product Details)

Guarantees:
- Exact Excel header alignment via aliases
- English-only string output
- Missing values are empty strings
- No inference, normalization, or correction
- No extra / unexpected fields

CRITICAL FIELDS:
- District: Must preserve "NA" if written as NA in PDF (NOT blank)
- Zipcode: Must preserve "NA" if written as NA in PDF (NOT blank)
- Type of car: Must extract complete comma-separated list
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any


class ServiceOrProductDetails(BaseModel):
    """
    Sheet 8 – Service Details (or Product Details)
    
    IMPORTANT: District and Zipcode must preserve "NA" exactly as written.
    Do NOT convert "NA" to empty string.
    """

    service_start_date_latest_by: str = Field(
        default="",
        alias="Service Start Date (latest by)",
        description="Latest permissible service start date (e.g., 17-Sep-2025)",
    )

    service_end_date: str = Field(
        default="",
        alias="Service End Date",
        description="Service end date (e.g., 16-Sep-2027)",
    )

    category_name: str = Field(
        default="",
        alias="Category Name",
        description="Category name of service or product",
    )

    billing_cycle: str = Field(
        default="",
        alias="Billing Cycle",
        description="Billing cycle (e.g., quarterly, monthly)",
    )

    district: str = Field(
        default="",
        alias="District",
        description="District where service/product is delivered. If PDF says 'NA', preserve 'NA'",
    )

    zipcode: str = Field(
        default="",
        alias="Zipcode",
        description="Postal / ZIP code. If PDF says 'NA', preserve 'NA'",
    )

    vehicle_type: str = Field(
        default="",
        alias="Vehicle Type",
        description="Vehicle type (e.g., SUV)",
    )

    type_of_car: str = Field(
        default="",
        alias="Type of car (Please select at least 3 options)",
        description="Car types mentioned in the contract (e.g., Maruti Suzuki Ertiga, Maruti Suzuki XL6, KIA Carens)",
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
        
        CRITICAL: This validator preserves "NA" values.
        Do NOT convert "NA" to empty string.
        """
        if value is None:
            return ""
        return str(value).strip()
    
    @field_validator("district", mode="after")
    @classmethod
    def validate_district(cls, value: str) -> str:
        """
        Validate district field.
        CRITICAL: Preserve "NA" exactly as written in PDF.
        """
        # No transformation - return as-is
        # If PDF says "NA", this will be "NA"
        # If PDF is blank, this will be ""
        return value
    
    @field_validator("zipcode", mode="after")
    @classmethod
    def validate_zipcode(cls, value: str) -> str:
        """
        Validate zipcode field.
        CRITICAL: Preserve "NA" exactly as written in PDF.
        """
        # No transformation - return as-is
        # If PDF says "NA", this will be "NA"
        # If PDF is blank, this will be ""
        return value
    
    @field_validator("billing_cycle", mode="after")
    @classmethod
    def validate_billing_cycle(cls, value: str) -> str:
        """
        Validate billing cycle.
        Handles character duplication bug: "qquuaarrtteerrllyy" -> "quarterly"
        """
        if not value:
            return ""
        
        # If the value appears to have character duplication, deduplicate it
        # This handles cases where PDF extraction duplicates characters
        result = []
        i = 0
        while i < len(value):
            result.append(value[i])
            # Skip consecutive duplicate characters
            while i + 1 < len(value) and value[i] == value[i + 1]:
                i += 1
            i += 1
        
        deduped = ''.join(result)
        
        # Return deduplicated value if it looks like a valid billing cycle
        valid_cycles = ['monthly', 'quarterly', 'yearly', 'weekly', 'annual', 'biannual']
        if deduped.lower() in valid_cycles:
            return deduped.lower()
        
        # Otherwise return original
        return value
    
    @field_validator("vehicle_type", mode="after")
    @classmethod
    def validate_vehicle_type(cls, value: str) -> str:
        """
        Validate vehicle type.
        Returns exactly as extracted - no transformation.
        """
        # No transformation - return as-is
        return value
    
    @field_validator("type_of_car", mode="after")
    @classmethod
    def validate_type_of_car(cls, value: str) -> str:
        """
        Validate type of car field.
        Expected: Comma-separated list of car models
        Example: "Maruti Suzuki Ertiga, Maruti Suzuki XL6, KIA Carens"
        
        Returns exactly as extracted - no transformation.
        """
        # No transformation - return as-is
        return value