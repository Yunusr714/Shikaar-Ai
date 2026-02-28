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

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.rides import router as rides_router
from app.api.users import router as users_router
from app.db.database import init_db
from app.db.models import User, RideHistory  # noqa: F401 – ensure tables are registered
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
    logger.info("⏳ Initialising database…")
    init_db()
    logger.info("✅ Database ready.")
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
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(users_router)
app.include_router(rides_router)


# ── Health check ────────────────────────────────────────────────────────
@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Simple liveness probe."""
    return {"status": "ok"}
