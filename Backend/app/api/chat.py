"""
Chat API router.

Exposes the POST /chat endpoint that accepts a user query with
conversation history and returns an AI-generated explanation
with optional flow-diagram steps.
"""

import logging
from typing import Annotated

from fastapi import APIRouter, Body
from pydantic import BaseModel, Field

from app.rag.chain import rag_pipeline

logger = logging.getLogger(__name__)


# ── Pydantic models ─────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    """A single message in conversation history."""

    role: str = Field(description="'user' or 'assistant'")
    content: str = Field(description="Message text")


class ChatRequest(BaseModel):
    """Incoming chat request payload."""

    query: str = Field(
        description="The user's natural-language question about cab service workflows.",
        min_length=1,
        max_length=2000,
    )
    history: list[ChatMessage] = Field(
        default_factory=list,
        description="Previous conversation messages for context memory.",
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


class StepResponse(BaseModel):
    """A single step in a flow diagram."""

    icon: str
    title: str
    description: str


class ChatResponse(BaseModel):
    """Chat endpoint response payload."""

    answer: str = Field(description="AI-generated explanation.")
    steps: list[StepResponse] = Field(
        default_factory=list,
        description="Optional flow-diagram steps with icons.",
    )
    page: int = Field(description="Current context page number.")
    total_pages: int = Field(description="Total available context pages.")


# ── Router ──────────────────────────────────────────────────────────────
router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat")
def chat(request: Annotated[ChatRequest, Body()]) -> ChatResponse:
    """Process a user query through the RAG pipeline and return an explanation.

    The endpoint accepts conversation history for context memory,
    retrieves relevant context from the knowledge base, and returns
    an answer with optional flow-diagram steps.
    """
    logger.info(
        "Chat request — query='%s', history_len=%d, page=%d",
        request.query[:80],
        len(request.history),
        request.page,
    )

    # Convert history to dicts for the pipeline
    history_dicts = [
        {"role": msg.role, "content": msg.content} for msg in request.history
    ]

    result = rag_pipeline(
        query=request.query,
        page=request.page,
        page_size=request.page_size,
        history=history_dicts,
    )

    return ChatResponse(
        answer=result.answer,
        steps=[
            StepResponse(icon=s.icon, title=s.title, description=s.description)
            for s in result.steps
        ],
        page=result.page,
        total_pages=result.total_pages,
    )
