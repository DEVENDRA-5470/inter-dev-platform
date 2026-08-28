from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.auth import router as auth_router
from app.api.github import router as github_router
from app.services.deployment import router as deployments_router

from app.core.database import engine


app = FastAPI(
    title="Internal Developer Platform API",
    version="0.1.0",
)


# Frontend origins allowed to call the backend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(auth_router)


# GitHub App routes
app.include_router(github_router)


# Deployment routes
app.include_router(deployments_router)


@app.on_event("startup")
async def startup():

    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        print("")
        print("================================")
        print("POSTGRESQL CONNECTED SUCCESSFULLY")
        print("================================")
        print("")

    except Exception as error:

        print("")
        print("================================")
        print("POSTGRESQL CONNECTION FAILED")
        print(f"ERROR: {error}")
        print("================================")
        print("")


@app.get("/")
async def root():

    return {
        "message": "Internal Developer Platform API is running",
        "version": "0.1.0",
    }


@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "database": "configured",
    }