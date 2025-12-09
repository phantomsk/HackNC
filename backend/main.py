from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.onboarding import router as onboarding_router
#from .routers import onboarding

app = FastAPI()
origins = [
    "origin"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(onboarding.router, prefix="/api/onboarding", tags=["onboarding"])

app.include_router(onboarding_router)


# Health check endpoint
default_response = {"status": "ok"}
@app.get("/api/health")
def health():
    return default_response
