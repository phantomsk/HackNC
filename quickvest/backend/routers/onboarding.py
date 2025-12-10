from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import google.generativeai as genai
import os
import json

load_dotenv()

key = os.environ.get("GEMINI_API_KEY")
if not key:
    raise RuntimeError("GEMINI_API_KEY environment variable is not set.")

genai.configure(api_key=key)

model = genai.GenerativeModel("gemini-2.0-flash")

# --- Router ---
router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

class OnboardingConfigResponse(BaseModel):
    api_base_url: str
    onboarding_base: str

@router.get("/config", response_model=OnboardingConfigResponse)
def get_onboarding_config(request: Request):
    """
    Returns configuration details for the onboarding process.
    """
    base_url = str(request.base_url).rstrip("/")
    onboarding_base = f"{base_url}/api/onboarding"
    return OnboardingConfigResponse(
        api_base_url=base_url,
        onboarding_base=onboarding_base
    )

class AccountCreateFromLicense(BaseModel):
    account_id: str
    success: bool
    extracted_data: dict


@router.post("/account/create-from-license", response_model=AccountCreateFromLicense)
async def account_create_from_license(file: UploadFile = File(...)):
    """
    Pipeline:
    Accept driver's license image
    Extract data using Gemini
    Account is created from auto-parsed data
    """
    try: 
        content = await file.read()

        image_part = {
            "mime_type": file.content_type or "image/jpeg",
            "data": content,
        }

        prompt = """
        You are an identity document parsing engine. 
        The user is uploading their driver's license. Extract all fields relevant for opening a financial or investment account.
        Return ONLY valid JSON with the following fields:
        {
            "first_name": "",
            "last_name": "",
            "full_name": "",
            "date_of_birth": "",
            "address": "",
            "city": "",
            "state": "",
            "zip_code": "",
            "country": "",
            "license_number": "",
            "issue_date": "",
            "expiry_date": ""
            "document_type": "driver_license"
            "raw_text": ""
            }
            
            If a field is missing in the document, return an empty string for that field but keep the field present.
            """
        
        response = model.generate_content(
            [
                prompt,
                image_part
            ]
        )

        extracted = json.loads(response.text)

        #TODO: Create Account creation logic here (DB insertion, etc)
        #Simulate account_id for now
        account_id = f"acct_{extracted.get('license_number', 'unknown')}"

        return AccountCreateFromLicense(
            account_id=account_id,
            success=True,
            extracted_data=extracted
        )
    
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Gemini response was not valid JSON. Check prompt or response text."
        )

    except Exception as e:
        print("Error in account_create_from_license:", repr(e))
        raise HTTPException(status_code=500, detail="Failed to process ID image.")
    
    

class QuizHelpRequest(BaseModel):
    question_text: str   # quiz question asked to user
    user_message: str    # what user asked about the question

class QuizHelpResponse(BaseModel):
    answer: str

@router.post("/quiz/help", response_model=QuizHelpResponse)
def quiz_help(payload: QuizHelpRequest):
    """
    Use Gemini to help answer a clarifying question on quiz question.
    """

    try: 
        prompt = f"""
        You are a helpful investment onboarding assistant.

        The user is taking a suitability / risk quiz. They were asked
        the following question:

        QUESTION:
        {payload.question_text}

        The user then asked this follow-up question:

        USER:
        {payload.user_message}

        Explain clearly what the question means, any terminology,
        and how the user should think about answering it.
        Be concise and user-friendly.
        """

        response = model.generate_content(prompt)
        text = response.text.strip()

        return QuizHelpResponse(answer=text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DocExtractResponse(BaseModel):
    extracted_data: dict

@router.post("/docs/extract", response_model=DocExtractResponse)
def extract_docs(file: UploadFile = File(...)):
    # TODO: Implement document extraction
    return DocExtractResponse(extracted_data={})

class KYCVerifyRequest(BaseModel):
    user_id: str
    kyc_data: dict

class KYCVerifyResponse(BaseModel):
    verified: bool
    reason: Optional[str]

@router.post("/kyc/verify", response_model=KYCVerifyResponse)
def kyc_verify(request: KYCVerifyRequest):
    # TODO: Implement KYC verification
    return KYCVerifyResponse(verified=True, reason=None)

class AccountCreateRequest(BaseModel):
    user_id: str
    account_data: dict

class AccountCreateResponse(BaseModel):
    account_id: str
    success: bool

@router.post("/account/create", response_model=AccountCreateResponse)
def account_create(request: AccountCreateRequest):
    # TODO: Implement account creation
    return AccountCreateResponse(account_id="acc_123", success=True)

class RecommendationRequest(BaseModel):
    user_id: str
    onboarding_data: dict

class RecommendationResponse(BaseModel):
    recommendations: list

@router.post("/recommendation", response_model=RecommendationResponse)
def recommendation(request: RecommendationRequest):
    # TODO: Implement recommendation logic
    return RecommendationResponse(recommendations=["Option A", "Option B"])
