from fastapi import FastAPI
from .routers import onboarding

app = FastAPI()

app.include_router(onboarding.router, prefix="/api/onboarding", tags=["onboarding"])

# Health check endpoint
default_response = {"status": "ok"}
@app.get("/api/health")
def health():
    return default_response
