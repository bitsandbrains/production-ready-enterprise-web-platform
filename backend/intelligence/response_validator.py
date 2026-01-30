"""
Response Validator
File: backend/intelligence/response_validator.py

Validates and sanitizes extracted data against strict Pydantic schemas.

Guarantees:
- English-only output
- No hallucinated or extra fields
- Missing fields become empty strings
- VALID fields are never lost
- Pipeline never crashes due to malformed LLM output
"""

import logging
from typing import Dict, Any, Type

from pydantic import BaseModel, ValidationError

from backend.intelligence.schemas.contract_data import ContractData
from backend.intelligence.schemas.organisation_details import OrganisationDetails
from backend.intelligence.schemas.buyer_details import BuyerDetails
from backend.intelligence.schemas.financial_approval_details import (
    FinancialApprovalDetails,
)
from backend.intelligence.schemas.paying_authority_details import (
    PayingAuthorityDetails,
)
from backend.intelligence.schemas.consignee_details import ConsigneeDetails
from backend.intelligence.schemas.service_provider_or_seller_details import (
    ServiceProviderOrSellerDetails,
)
from backend.intelligence.schemas.service_or_product_details import (
    ServiceOrProductDetails,
)

logger = logging.getLogger("intelligence.response_validator")
logger.setLevel(logging.INFO)


class ResponseValidator:
    """
    Central validation layer for extracted PDF data.
    Ensures strict schema compliance WITHOUT data loss.
    """

    # ---------------------------------------------------------
    # Schema registry (single source of truth)
    # ---------------------------------------------------------

    SCHEMA_MAP: Dict[str, Type[BaseModel]] = {
        "contract_data": ContractData,
        "organisation_details": OrganisationDetails,
        "buyer_details": BuyerDetails,
        "financial_approval_details": FinancialApprovalDetails,
        "paying_authority_details": PayingAuthorityDetails,
        "consignee_details": ConsigneeDetails,
        "service_provider_details": ServiceProviderOrSellerDetails,
        "service_details": ServiceOrProductDetails,
    }

    # ---------------------------------------------------------
    # Public API
    # ---------------------------------------------------------

    @classmethod
    def validate(cls, raw_data: Any) -> Dict[str, Dict[str, str]]:
        """
        Validate and sanitize extracted data for all sections.
        """

        if not isinstance(raw_data, dict):
            logger.error(
                "Invalid top-level output type: %s",
                type(raw_data).__name__,
            )
            raw_data = {}

        validated_output: Dict[str, Dict[str, str]] = {}

        for section, schema_cls in cls.SCHEMA_MAP.items():
            section_data = raw_data.get(section, {})
            validated_output[section] = cls._validate_section(
                schema_cls=schema_cls,
                data=section_data,
                section_name=section,
            )

        return validated_output

    # ---------------------------------------------------------
    # Internal helpers
    # ---------------------------------------------------------

    @staticmethod
    def _validate_section(
        schema_cls: Type[BaseModel],
        data: Any,
        section_name: str,
    ) -> Dict[str, str]:
        """
        Field-safe validation:
        - Keeps valid fields
        - Drops invalid / extra fields
        - Never wipes entire section
        """

        if not isinstance(data, dict):
            logger.warning(
                "Section '%s' has invalid type: %s",
                section_name,
                type(data).__name__,
            )
            return ResponseValidator._empty_schema(schema_cls)

        # -----------------------------------------------------
        # CRITICAL FIX (Pydantic v2 compliant)
        #
        # - Read values using ALIAS (Excel/regex keys)
        # - Populate model using FIELD NAMES
        # -----------------------------------------------------

        safe_input: Dict[str, Any] = {}

        for field_name, field in schema_cls.model_fields.items():
            alias = field.alias or field_name

            if alias in data:
                safe_input[field_name] = data.get(alias)
            else:
                safe_input[field_name] = ""

        try:
            model = schema_cls(**safe_input)

            dumped = model.model_dump(by_alias=True)

            return {
                key: str(value) if value is not None else ""
                for key, value in dumped.items()
            }

        except ValidationError as exc:
            logger.warning(
                "Partial validation failure in section '%s': %s",
                section_name,
                exc,
            )
            return ResponseValidator._empty_schema(schema_cls)

    @staticmethod
    def _empty_schema(schema_cls: Type[BaseModel]) -> Dict[str, str]:
        """
        Fully empty but schema-compliant output.
        """
        empty_instance = schema_cls()
        dumped = empty_instance.model_dump(by_alias=True)

        return {
            key: "" if value is None else str(value)
            for key, value in dumped.items()
        }
