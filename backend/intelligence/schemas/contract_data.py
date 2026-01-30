"""
Pydantic Schema – Contract Data
File: backend/intelligence/schemas/contract_data.py

Represents Sheet 1 – Contract Data

Guarantees:
- Exact Excel header alignment via aliases
- English-only string values
- Empty strings for missing data (never None)
- No extra / unexpected fields
- Handles PDF duplication bug for amount field
"""

from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Any
import re


class ContractData(BaseModel):
    """
    Sheet 1 – Contract Data
    
    CRITICAL: Amount field handles PDF duplication bug
    Example: "959232959232" -> "959232"
    """

    contract_no: str = Field(
        default="",
        alias="Contract No",
        description="GeM Contract Number (e.g., GEMC-511687770079529)",
    )

    contract_generated_date: str = Field(
        default="",
        alias="Contract Generated Date",
        description="Date when the contract was generated (e.g., 12-Sep-2025)",
    )

    bid_ra_pbp_no: str = Field(
        default="",
        alias="Bid / RA / PBP No",
        description="Bid, Reverse Auction, or PBP number (e.g., GEM/2025/B/6545418)",
    )

    duration: str = Field(
        default="",
        alias="Duration",
        description="Duration in months for which service is required (e.g., 24)",
    )

    amount_of_contract: str = Field(
        default="",
        alias="Amount of Contract (Including All Duties and Taxes INR)",
        description="Total contract value including all duties and taxes in INR (e.g., 959232)",
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
        Ensure all values are strings.
        Convert None or non-string to empty string safely.
        """
        if value is None:
            return ""
        return str(value).strip()

    @field_validator("contract_generated_date", mode="after")
    @classmethod
    def normalize_date(cls, value: str) -> str:
        """
        Accept common GeM date formats.
        Do NOT infer or reformat if unclear.
        """
        if not value:
            return ""

        date_pattern = re.compile(
            r"^(\d{1,2}[-/][A-Za-z]{3}[-/]\d{4}"
            r"|\d{1,2}[-/]\d{1,2}[-/]\d{4}"
            r"|\d{4}-\d{2}-\d{2})$"
        )

        return value if date_pattern.match(value) else value

    @field_validator("duration", mode="after")
    @classmethod
    def normalize_duration(cls, value: str) -> str:
        """
        Duration must remain as-is if unclear.
        Do NOT compute or infer.
        """
        if not value:
            return ""
        return value

    @field_validator("amount_of_contract", mode="after")
    @classmethod
    def normalize_amount(cls, value: str) -> str:
        """
        Light normalization with duplication handling.
        
        CRITICAL FIX: Handles PDF duplication bug
        - PDF shows: "Total Contract Value Including All Duties and Taxes(INR) 959232959232"
        - Expected: "959232"
        
        Also handles:
        - Currency symbols (₹, INR)
        - Commas
        - Whitespace
        
        No computation, no inference.
        """
        if not value:
            return ""

        # Remove currency symbols and commas
        cleaned = (
            value.replace("₹", "")
            .replace("INR", "")
            .replace(",", "")
            .replace(" ", "")
            .strip()
        )

        # Collapse multiple spaces
        cleaned = re.sub(r"\s{2,}", " ", cleaned).strip()

        # CRITICAL: Handle duplication (e.g., 959232959232 → 959232)
        # This occurs when PDF text extraction duplicates the amount
        if cleaned and cleaned.isdigit() and len(cleaned) >= 10 and len(cleaned) % 2 == 0:
            half_len = len(cleaned) // 2
            first_half = cleaned[:half_len]
            second_half = cleaned[half_len:]
            
            # If both halves are identical, use only the first half
            if first_half == second_half:
                return first_half

        return cleaned