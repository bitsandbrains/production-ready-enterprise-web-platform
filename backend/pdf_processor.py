"""
PDF Processing Module
File: backend/pdf_processor.py

Responsibilities:
- Load PDF
- Extract raw text
- Perform minimal, lossless normalization
- Delegate extraction to IntelligenceProcessor
"""

from pathlib import Path
import re
import logging
from typing import Dict, Union

import pdfplumber

from backend.intelligence.processor import IntelligenceProcessor


# -------------------------------------------------
# Logger configuration
# -------------------------------------------------

logger = logging.getLogger("backend.pdf_processor")
logger.setLevel(logging.INFO)


class PDFProcessor:
    """
    Thin PDF text extractor.

    Responsibilities:
    - Extract raw textual content from PDF
    - Perform minimal, safe normalization
    - Delegate ALL field extraction to IntelligenceProcessor
    """

    def __init__(self) -> None:
        self.intelligence = IntelligenceProcessor()

    # -------------------------------------------------
    # Public API
    # -------------------------------------------------

    def process_pdf(
        self,
        pdf_path: Union[str, Path],
    ) -> Dict[str, Dict[str, str]]:
        """
        Process a single GeM PDF and return structured data
        for all required Excel sheets.
        """

        pdf_path = Path(pdf_path)

        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF not found: {pdf_path}")

        raw_text = self._extract_text(pdf_path)

        if not raw_text.strip():
            raise RuntimeError(
                f"No extractable text found in PDF: {pdf_path.name}"
            )

        cleaned_text = self._clean_text(raw_text)

        logger.info(
            "PDF loaded successfully | file=%s | characters=%d",
            pdf_path.name,
            len(cleaned_text),
        )

        # Delegate ALL extraction to intelligence layer
        return self.intelligence.process(cleaned_text)

    # -------------------------------------------------
    # Internal helpers
    # -------------------------------------------------

    def _extract_text(self, pdf_path: Path) -> str:
        """
        Extract raw text from all PDF pages.
        Preserves page boundaries for context.
        """

        text_chunks = []

        with pdfplumber.open(pdf_path) as pdf:
            for page_index, page in enumerate(pdf.pages, start=1):
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_chunks.append(
                        f"\n\n--- PAGE {page_index} ---\n{page_text}"
                    )
                else:
                    logger.warning(
                        "No text extracted from page %d in %s",
                        page_index,
                        pdf_path.name,
                    )

        return "\n".join(text_chunks)

    def _clean_text(self, text: str) -> str:
        """
        Minimal, lossless normalization.

        IMPORTANT:
        - Do NOT remove non-English scripts
        - Do NOT infer or reformat values
        - Preserve original wording as much as possible
        """

        # Normalize non-breaking spaces
        text = text.replace("\xa0", " ")

        # Normalize excessive spaces & tabs (preserve newlines)
        text = re.sub(r"[ \t]+", " ", text)

        # Normalize excessive blank lines
        text = re.sub(r"\n{3,}", "\n\n", text)

        return text.strip()
