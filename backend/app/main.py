"""Voyager Backend — FastAPI Application"""

from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import trips, agent

app = FastAPI(
    title="Voyager API",
    description="AI Travel Planning Agent Backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(trips.router)
app.include_router(agent.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "voyager-api"}
