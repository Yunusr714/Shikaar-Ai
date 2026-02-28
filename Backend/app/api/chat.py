"""
Chat API router.

Exposes the POST /chat endpoint that accepts a user query with
pagination parameters and returns an AI-generated explanation.
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Body
from pydantic import BaseModel, Field

from app.rag.chain import rag_pipeline

logger = logging.getLogger(__name__)


# ── Pydantic models ─────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    """Incoming chat request payload."""

    query: str = Field(
        description="The user's natural-language question about cab service workflows.",
        min_length=1,
        max_length=2000,
    )
    page: int = Field(
        default=1,
        ge=1,
        description="Page number for paginated context retrieval.",
    )
    page_size: int | None = Field(
        default=None,
        ge=1,
        le=20,
        description="Optional override for documents per page.",
    )


class ChatResponse(BaseModel):
    """Chat endpoint response payload."""

    answer: str = Field(description="AI-generated explanation.")
    page: int = Field(description="Current context page number.")
    total_pages: int = Field(description="Total available context pages.")


# ── Router ──────────────────────────────────────────────────────────────
router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
def chat(request: Annotated[ChatRequest, Body()]) -> ChatResponse:
    """Process a user query through the RAG pipeline and return an explanation.

    The endpoint retrieves relevant context from the knowledge base,
    paginates it, and sends the paginated context along with the query
    to Google Gemini for answer generation.
    """
    logger.info(
        "Chat request — query='%s', page=%d",
        request.query[:80],
        request.page,
    )

    result = rag_pipeline(
        query=request.query,
        page=request.page,
        page_size=request.page_size,
    )

    return ChatResponse(
        answer=result.answer,
        page=result.page,
        total_pages=result.total_pages,
    )
