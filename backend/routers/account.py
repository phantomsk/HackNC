from fastapi import APIRouter
from pydantic import BaseModel
from ..services.wso2_client import create_user

router = APIRouter(prefix="/api/onboarding/account", tags=["account"])


class AccountReq(BaseModel):
    applicantId: str
    username: str
    password: str
    email: str | None = None


@router.post("/create")
async def create_account(req: AccountReq):
    # Do not store password locally; pass to WSO2
    res = await create_user(req.username, req.password, req.email)
    return {"ok": res.get("ok", False), "wso2UserId": res.get("wso2UserId")}
