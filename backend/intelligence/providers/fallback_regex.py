"""
Regex Fallback Provider - ULTIMATE VERSION (FINAL – VERIFIED)
File: backend/intelligence/providers/fallback_regex.py

CRITICAL FIXES:
- Robust Service Provider section slicing
- GeM Seller ID extracted from FULL TEXT (correct PDF layout)
- MSME Registration Number extracted from section
- No fragile end-marker dependency
"""

import re
from typing import Dict, Optional


class RegexFallbackProvider:
    """
    Deterministic, audit-safe regex extractor for GeM contracts.
    """

    # =========================================================
    # Shared atomic patterns
    # =========================================================

    GSTIN = re.compile(r"\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z\d\b")
    EMAIL = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
    PINCODE = re.compile(r"\b\d{6}\b")

    LANDLINE = re.compile(r"\b\d{3,5}-\d{6,8}-?\b")
    MOBILE = re.compile(r"\b0?[6-9]\d{9}\b")

    # =========================================================
    # SECTION BLOCK HELPERS
    # =========================================================

    @staticmethod
    def _section(text: str, start: str, end: Optional[str] = None) -> str:
        if end:
            pattern = re.escape(start) + r"(.*?)" + re.escape(end)
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            if match:
                return match.group(1).strip()

        pattern = re.escape(start) + r"(.*)"
        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
        return match.group(1).strip() if match else ""

    @staticmethod
    def _extract_with_pattern(pattern: re.Pattern, text: str, group: int = 1) -> str:
        match = pattern.search(text)
        if not match:
            return ""
        try:
            return match.group(group).strip()
        except Exception:
            return ""

    # =========================================================
    # PUBLIC API
    # =========================================================

    def extract(self, text: str) -> Dict[str, Dict[str, str]]:
        return {
            "contract_data": self._contract_data(text),
            "organisation_details": self._organisation_details(text),
            "buyer_details": self._buyer_details(text),
            "financial_approval_details": self._financial_approval(text),
            "paying_authority_details": self._paying_authority(text),
            "consignee_details": self._consignee(text),
            "service_provider_details": self._service_provider(text),
            "service_details": self._service_details(text),
        }

    # =========================================================
    # CONTRACT DATA
    # =========================================================

    def _contract_data(self, text: str) -> Dict[str, str]:
        return {
            "Contract No": self._extract_with_pattern(
                re.compile(r"Contract No\.?\s*[:\-]?\s*(GEM[C]?-?\d+)", re.I),
                text,
            ),
            "Contract Generated Date": self._extract_with_pattern(
                re.compile(r"Generated Date\s*[:\-]?\s*([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})"),
                text,
            ),
            "Bid / RA / PBP No": self._extract_with_pattern(
                re.compile(r"Bid/RA/PBP No\.?\s*[:\-]?\s*([A-Z0-9/]+)", re.I),
                text,
            ),
            "Duration": self._extract_with_pattern(
                re.compile(
                    r"Duration in Months for which service is required\s*[:\-]?\s*(\d+)",
                    re.I,
                ),
                text,
            ),
            "Amount of Contract (Including All Duties and Taxes INR)": self._extract_contract_amount(text),
        }

    @staticmethod
    def _extract_contract_amount(text: str) -> str:
        patterns = [
            re.compile(r"Total Contract Value Including All Duties and Taxes\s*\(INR\)\s*(\d+)", re.I),
            re.compile(r"Amount of Contract.*?\(INR\)\s*(\d+)", re.I | re.DOTALL),
        ]
        for p in patterns:
            m = p.search(text)
            if m:
                val = m.group(1).replace(",", "")
                if len(val) % 2 == 0 and val[: len(val)//2] == val[len(val)//2:]:
                    return val[: len(val)//2]
                return val
        return ""

    # =========================================================
    # SERVICE PROVIDER DETAILS (FINAL FIX)
    # =========================================================

    def _service_provider(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Service Provider Details")

        # 🔑 GeM Seller ID — GLOBAL METADATA → FULL TEXT
        gem_seller_id = self._extract_with_pattern(
            re.compile(
                r"(?:जेम विक्रेता आईडी|GeM Seller ID)\s*[:।\-|]?\s*[\r\n\s]*([A-Z0-9]{10,})",
                re.IGNORECASE | re.UNICODE,
            ),
            text,   # ✅ FIXED
        )

        # MSME — SECTION DATA
        msme = self._extract_with_pattern(
            re.compile(
                r"(?:एमएसएमई पंजीकरण संख्या|MSME Registration Number|MSME Registration number)"
                r"\s*[:।\-|]?\s*[\r\n\s]*([A-Z0-9]+)",
                re.IGNORECASE | re.UNICODE,
            ),
            block,
        )

        gstin = self._extract_with_pattern(
            re.compile(
                r"(?:जीएसटीआईएन|GSTIN)\s*[:।\-|]?\s*[\r\n\s]*([A-Z0-9]+(?:\s*\([A-Z]\))?)",
                re.IGNORECASE | re.UNICODE,
            ),
            block,
        )

        address_match = re.search(
            r"Address\s*[:\-]?\s*(.*?)(?=\n\s*(?:MSME|GSTIN|$))",
            block,
            re.DOTALL | re.IGNORECASE,
        )
        address = " ".join(address_match.group(1).split()) if address_match else ""

        return {
            "GeM Seller ID": gem_seller_id,
            "Company Name": self._extract_with_pattern(re.compile(r"Company Name\s*[:\-]?\s*([^\n|]+)"), block),
            "Contact No.": self._extract_with_pattern(self.MOBILE, block),
            "Email ID": self._extract_with_pattern(self.EMAIL, block),
            "Address": address,
            "MSME Registration Number": msme,
            "GSTIN": gstin,
            "MSME Status as verified by buyer": self._extract_with_pattern(
                re.compile(r"MSME Status as verified by buyer\s*[:\-]?\s*([^\n|]+)"), block
            ),
            "MSE Social Category": self._extract_with_pattern(
                re.compile(r"MSE Social Category\s*[:\-]?\s*([^\n|]+)"), block
            ),
            "MSE Gender": self._extract_with_pattern(
                re.compile(r"MSE Gender\s*[:\-]?\s*([^\n|]+)"), block
            ),
        }

    # =========================================================
    # OTHER SECTIONS (UNCHANGED)
    # =========================================================

    def _organisation_details(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Organisation Details", "Buyer Details")
        return {
            "Type": self._extract_with_pattern(re.compile(r"Type\s*[:\-]?\s*([^\n|]+)"), block),
            "Ministry": self._extract_with_pattern(re.compile(r"Ministry\s*[:\-]?\s*([^\n|]+)"), block),
            "Department": self._extract_with_pattern(re.compile(r"Department\s*[:\-]?\s*([^\n|]+)"), block),
            "Organisation Name": self._extract_with_pattern(re.compile(r"Organisation Name\s*[:\-]?\s*([^\n|]+)"), block),
            "Office Zone": self._extract_with_pattern(re.compile(r"Office Zone\s*[:\-]?\s*([A-Z]+)", re.I), block),
        }

    def _buyer_details(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Buyer Details", "Financial Approval")
        contact = self._extract_with_pattern(self.LANDLINE, block) or self._extract_with_pattern(self.MOBILE, block)
        addr = re.search(r"Address\s*[:\-]?\s*(.*)", block, re.DOTALL | re.I)
        return {
            "Designation": self._extract_with_pattern(re.compile(r"Designation\s*[:\-]?\s*([^\n|]+)"), block),
            "Contact No.": contact,
            "Email ID": self._extract_with_pattern(self.EMAIL, block),
            "GSTIN": self._extract_with_pattern(self.GSTIN, block),
            "Address": " ".join(addr.group(1).split()) if addr else "",
        }

    def _financial_approval(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Financial Approval Details", "Paying Authority")
        return {
            "IFD Concurrence": self._extract_with_pattern(
                re.compile(r"IFD Concurrence\s*[:\-]?\s*(Yes|No)", re.I), block
            ),
            "Designation of Administrative Approval": self._extract_with_pattern(
                re.compile(r"Designation of Administrative Approval\s*[:\-]?\s*([^\n|]+)"), block
            ),
            "Designation of Financial Approval": self._extract_with_pattern(
                re.compile(r"Designation of Financial Approval\s*[:\-]?\s*([^\n|]+)"), block
            ),
        }

    def _paying_authority(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Paying Authority Details", "Consignee")
        addr = re.search(r"Address\s*[:\-]?\s*(.*)", block, re.DOTALL | re.I)
        return {
            "Role": self._extract_with_pattern(re.compile(r"Role\s*[:\-]?\s*([A-Z]+)", re.I), block),
            "Payment Mode": self._extract_with_pattern(re.compile(r"Payment Mode\s*[:\-]?\s*([A-Za-z\s]+)", re.I), block),
            "Designation": self._extract_with_pattern(re.compile(r"Designation\s*[:\-]?\s*([^\n|]+)"), block),
            "Email ID": self._extract_with_pattern(self.EMAIL, block),
            "GSTIN": self._extract_with_pattern(self.GSTIN, block),
            "Address": " ".join(addr.group(1).split()) if addr else "",
        }

    def _consignee(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Consignee Details", "Service Provider Details")
        contact = self._extract_with_pattern(self.LANDLINE, block) or self._extract_with_pattern(self.MOBILE, block)
        addr = re.search(r"Address\s*[:\-]?\s*(.*)", block, re.DOTALL | re.I)
        return {
            "Contact": contact,
            "Email ID": self._extract_with_pattern(self.EMAIL, block),
            "GSTIN": self._extract_with_pattern(self.GSTIN, block) or "-",
            "Address": " ".join(addr.group(1).split()) if addr else "",
            "Service Description": self._extract_with_pattern(
                re.compile(r"Service Description\s*[:\-]?\s*(.*)", re.I), block
            ),
        }

    def _service_details(self, text: str) -> Dict[str, str]:
        block = self._section(text, "Service Details")
        billing = self._extract_with_pattern(re.compile(r"Billing Cycle\s*[:\-]?\s*([a-z]+)", re.I), block)
        return {
            "Service Start Date (latest by)": self._extract_with_pattern(
                re.compile(r"Service Start Date.*?([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})"), block
            ),
            "Service End Date": self._extract_with_pattern(
                re.compile(r"Service End Date\s*[:\-]?\s*([0-9]{1,2}-[A-Za-z]{3}-[0-9]{4})"), block
            ),
            "Category Name": self._extract_with_pattern(re.compile(r"Category Name\s*[:\-]?\s*([^\n|]+)"), block),
            "Billing Cycle": billing,
            "District": self._extract_with_pattern(re.compile(r"District\s+(NA|[A-Za-z\s]+)", re.I), block),
            "Zipcode": self._extract_with_pattern(re.compile(r"Zipcode\s+(NA|\d+)", re.I), block),
            "Vehicle Type": self._extract_with_pattern(re.compile(r"Vehicle Type\s+([A-Z]+)", re.I), block),
            "Type of car (Please select at least 3 options)": self._extract_with_pattern(
                re.compile(r"Type of car\s*\(Please select at least 3 options\)\s*(.*)", re.I | re.DOTALL),
                block,
            ),
        }
