from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    next_question: str
    progress: float

@router.post("/chat/next-question", response_model=ChatResponse)
def next_question(request: ChatRequest):
    # TODO: Implement logic
    return ChatResponse(next_question="What is your name?", progress=0.1)

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
