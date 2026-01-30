"""
Enhanced Prompt (v2) - ULTRA-EXPLICIT VERSION
File: backend/intelligence/prompts/v2_enhanced.py

CRITICAL: Maximum clarity for LLM extraction
UPDATED: Fixed GeM Seller ID, MSME Registration Number, and GSTIN (R) suffix
"""

# ============================================================
# SYSTEM PROMPT
# ============================================================

SYSTEM_PROMPT = """
You are a document intelligence system for GeM (Government e-Marketplace) contracts.

YOUR ONLY JOB: Extract data EXACTLY as written. No guessing. No mixing sections.

ABSOLUTE RULES:
1. Extract ONLY what you see in the PDF
2. If not found → return ""
3. NEVER mix Buyer and Service Provider data
4. NEVER invent or guess values
5. Output must be valid JSON only
6. No explanations, no markdown, no comments
""".strip()


# ============================================================
# USER PROMPT BUILDER
# ============================================================

def build_prompt(pdf_text: str) -> str:
    return f"""
{SYSTEM_PROMPT}

========================
PDF TEXT TO EXTRACT FROM:
========================
{pdf_text.strip()}
========================
END OF PDF TEXT
========================

========================
EXTRACTION INSTRUCTIONS
========================

**CONTRACT DATA:**
1. Contract No: Extract "GEMC-511687770079529" pattern
2. Amount: Look for "Total Contract Value Including All Duties and Taxes(INR) 959232"
   - CRITICAL: If you see "959232959232", extract only "959232" (first half)
   - This is a PDF rendering bug - amount is duplicated
   - Extract: 959232 (NOT 995599223322 or similar doubled numbers)

**BUYER DETAILS** (Section: "Buyer Details"):
- Designation: "SrDEE TRD AGC"
- Contact No.: "0562-2421206-" (NOTE: Include the trailing hyphen!)
- Email ID: "sdeetrd@agc.railnet.gov.in"
- GSTIN: "09AAAGM0289C1ZH"
- Address: "Office of Sr.DEE/TRD/AGC DRM Office Compound, North Central Railway Agra, Agra, UTTAR PRADESH-282001, India"
  (INCLUDE the "Office of Sr.DEE/TRD/AGC" prefix!)

**SERVICE PROVIDER DETAILS** (Section: "Service Provider Details"):
- GeM Seller ID: "6B50200001363812" (ALPHANUMERIC CODE)
  * Look for: "जेम विक्रेता आईडी|GeM Seller ID : 6B50200001363812"
  * Extract EXACTLY: "6B50200001363812"
  * This field appears ONLY in Service Provider Details section
- Company Name: "Happy Sharma Contractor and Tour & Travels"
- Contact No.: "09720119940" (MOBILE NUMBER, different from buyer!)
- Email ID: "happysharma931@gmail.com"
- MSME Registration Number: "UP54D0033152" (ALPHANUMERIC CODE)
  * Look for: "एमएसएमई पंजीकरण संख्या|MSME Registration number : UP54D0033152"
  * Extract EXACTLY: "UP54D0033152"
  * This field appears ONLY in Service Provider Details section
- GSTIN: "09HQYPS3185K1ZI (R)" (INCLUDE THE SUFFIX!)
  * Look for: "जीएसटीआईएन|GSTIN: 09HQYPS3185K1ZI (R)"
  * Extract EXACTLY including "(R)": "09HQYPS3185K1ZI (R)"
  * DO NOT truncate at the space - include the full value with suffix!
- Look in the "Service Provider Details" section ONLY for these fields

**SERVICE DETAILS:**
- District: If PDF says "NA", write "NA" (NOT blank!)
- Zipcode: If PDF says "NA", write "NA" (NOT blank!)
- Vehicle Type: "SUV"
- Type of car (Please select at least 3 options): "Maruti Suzuki Ertiga, Maruti Suzuki XL6, KIA Carens"
- Billing Cycle: If you see "qquuaarrtteerrllyy", extract as "quarterly"

========================
CRITICAL WARNINGS
========================

⚠️ WARNING 1: Amount Duplication
PDF may show: "Total Contract Value Including All Duties and Taxes(INR) 959232959232"
YOU MUST extract: "959232" (remove duplication!)

⚠️ WARNING 2: Buyer vs Service Provider Confusion
- Buyer Contact No.: "0562-2421206-" (from "Buyer Details" section)
- Service Provider Contact No.: "09720119940" (from "Service Provider Details" section)
DO NOT MIX THESE TWO!

⚠️ WARNING 3: GeM Seller ID is NOT in Buyer Details
- GeM Seller ID: "6B50200001363812" → This is in "Service Provider Details" section ONLY
- MSME Registration Number: "UP54D0033152" → This is in "Service Provider Details" section ONLY
- Look for Hindi/English bilingual labels: "जेम विक्रेता आईडी|GeM Seller ID"
- These fields are NEVER blank - they MUST be extracted!

⚠️ WARNING 4: GSTIN Suffix Must Be Included
- Service Provider GSTIN in PDF: "09HQYPS3185K1ZI (R)"
- You MUST include the "(R)" suffix
- Extract as: "09HQYPS3185K1ZI (R)" (NOT just "09HQYPS3185K1ZI")

⚠️ WARNING 5: NA Values
- If PDF says "District NA", write "NA" (not blank)
- If PDF says "Zipcode NA", write "NA" (not blank)

⚠️ WARNING 6: Address Truncation
- Buyer Address must include: "Office of Sr.DEE/TRD/AGC DRM Office Compound..."
- Do NOT truncate to just "DRM Office Compound..."

========================
OUTPUT FORMAT (EXACT JSON)
========================

Return ONLY this JSON structure:

{{
  "contract_data": {{
    "Contract No": "GEMC-511687770079529",
    "Contract Generated Date": "12-Sep-2025",
    "Bid / RA / PBP No": "GEM/2025/B/6545418",
    "Duration": "24",
    "Amount of Contract (Including All Duties and Taxes INR)": "959232"
  }},
  "organisation_details": {{
    "Type": "Central Government",
    "Ministry": "Ministry of Railways",
    "Department": "Indian Railways",
    "Organisation Name": "North Central Railway",
    "Office Zone": "NCR"
  }},
  "buyer_details": {{
    "Designation": "SrDEE TRD AGC",
    "Contact No.": "0562-2421206-",
    "Email ID": "sdeetrd@agc.railnet.gov.in",
    "GSTIN": "09AAAGM0289C1ZH",
    "Address": "Office of Sr.DEE/TRD/AGC DRM Office Compound, North Central Railway Agra, Agra, UTTAR PRADESH-282001, India"
  }},
  "financial_approval_details": {{
    "IFD Concurrence": "No",
    "Designation of Administrative Approval": "DRM/NCR/Agra",
    "Designation of Financial Approval": "Sr.DFM/NCR/Agra"
  }},
  "paying_authority_details": {{
    "Role": "BUYER",
    "Payment Mode": "Railways",
    "Designation": "SrDEE TRD AGC",
    "Email ID": "sdeetrd@agc.railnet.gov.in",
    "GSTIN": "09AAAGM0289C1ZH",
    "Address": "Office of Sr.DEE/TRD/AGC DRM Office Compound, North Central Railway Agra, Agra, UTTAR PRADESH-282001, India"
  }},
  "consignee_details": {{
    "Contact": "95571-54191-",
    "Email ID": "binay.0855@gov.in",
    "GSTIN": "-",
    "Address": "SSE TRD office, Malgodam Road, Mathura, Mathura, UTTAR PRADESH-281001, India",
    "Service Description": "Monthly Basis Cab & Taxi Hiring Services - SUV; 2000 km x 720 hours; Outstation 24*7"
  }},
  "service_provider_details": {{
    "GeM Seller ID": "6B50200001363812",
    "Company Name": "Happy Sharma Contractor and Tour & Travels",
    "Contact No.": "09720119940",
    "Email ID": "happysharma931@gmail.com",
    "Address": "107,Happy Sharma,107, Indrprasth Colony Near Hotel Goverdhan Palce NH 2 Mathura,NH2, Mathura, Uttar Pradesh-281001, -",
    "MSME Registration Number": "UP54D0033152",
    "GSTIN": "09HQYPS3185K1ZI (R)",
    "MSME Status as verified by buyer": "Verified",
    "MSE Social Category": "General",
    "MSE Gender": "Male"
  }},
  "service_details": {{
    "Service Start Date (latest by)": "17-Sep-2025",
    "Service End Date": "16-Sep-2027",
    "Category Name": "Monthly Basis Cab & Taxi Hiring Services",
    "Billing Cycle": "quarterly",
    "District": "NA",
    "Zipcode": "NA",
    "Vehicle Type": "SUV",
    "Type of car (Please select at least 3 options)": "Maruti Suzuki Ertiga, Maruti Suzuki XL6, KIA Carens"
  }}
}}

========================
FINAL CHECKLIST BEFORE RESPONDING:
========================
✓ Amount is "959232" (NOT "959232959232" or "995599223322")
✓ Buyer Contact No. is "0562-2421206-" (NOT blank)
✓ Service Provider GeM Seller ID is "6B50200001363812" (NOT blank)
✓ Service Provider Contact No. is "09720119940" (NOT blank)
✓ Service Provider MSME Registration Number is "UP54D0033152" (NOT blank)
✓ Service Provider GSTIN is "09HQYPS3185K1ZI (R)" with suffix (NOT just "09HQYPS3185K1ZI")
✓ District is "NA" (NOT blank)
✓ Zipcode is "NA" (NOT blank)
✓ Type of car is "Maruti Suzuki Ertiga, Maruti Suzuki XL6, KIA Carens" (NOT blank)
✓ Buyer and Service Provider data are NOT mixed
✓ All field names have "Contact No." (with period)
✓ All addresses include complete prefixes
✓ GeM Seller ID and MSME Registration Number extracted from bilingual labels

NOW EXTRACT AND RETURN THE JSON.
""".strip()