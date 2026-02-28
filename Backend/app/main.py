"""
FastAPI application entrypoint.

Sets up the application with CORS middleware, API router,
a health-check endpoint, and a lifespan hook that warm-loads the
vector-store retriever on startup.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.rag.retriever import load_retriever

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan ────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Warm-load the retriever so the first request is fast."""
    logger.info("⏳ Loading vector store retriever…")
    load_retriever()
    logger.info("✅ Retriever loaded — server is ready.")
    yield
    logger.info("🛑 Shutting down.")


# ── App ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="ShikaarAI — Cab Service Explanation API",
    description=(
        "A Generative-AI chatbot that explains cab service workflows "
        "including ride booking, driver assignment, cancellations, "
        "safety features, and fare estimation."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────────────────────
app.include_router(chat_router)


# ── Health check ────────────────────────────────────────────────────────
@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Simple liveness probe."""
    return {"status": "ok"}
