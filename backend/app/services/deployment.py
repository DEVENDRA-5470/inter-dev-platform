from fastapi import APIRouter, BackgroundTasks, HTTPException
import asyncio
import uuid
from datetime import datetime, timezone
from pydantic import BaseModel


router = APIRouter(
    prefix="/deployments",
    tags=["Deployments"],
)