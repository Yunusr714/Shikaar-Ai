"""
RAG chain — orchestrates retrieval, pagination, and LLM generation.

This module is the single entry-point consumed by both the Streamlit
testing interface (direct call) and the FastAPI chat endpoint.
"""

import logging
from dataclasses import dataclass, field
from typing import List

from app.rag.retriever import load_retriever
from app.rag.pagination import paginate_results, PaginationResult
from app.llm.gemini import generate_answer
from app.prompts.system_prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)


@dataclass
class RAGResponse:
    """Structured response from the RAG pipeline."""

    answer: str = ""
    page: int = 1
    total_pages: int = 1
    context_chunks: List[str] = field(default_factory=list)


def rag_pipeline(
    query: str,
    page: int = 1,
    page_size: int | None = None,
) -> RAGResponse:
    """Run the full Retrieval-Augmented Generation pipeline.

    1. Retrieve semantically relevant documents from the vector store.
    2. Paginate the results to the requested page.
    3. Build a prompt with system instructions + paginated context.
    4. Send the prompt to Gemini and return a structured response.

    Args:
        query: The user's natural-language question.
        page: 1-based page number for context pagination.
        page_size: Optional override for documents per page.

    Returns:
        A ``RAGResponse`` with the generated answer and metadata.
    """
    # ── 1. Retrieve ──────────────────────────────────────────────────
    retriever = load_retriever()
    docs = retriever.invoke(query)
    logger.info("Retrieved %d document(s) for query: '%s'", len(docs), query)

    # ── 2. Paginate ──────────────────────────────────────────────────
    pagination: PaginationResult = paginate_results(docs, page, page_size)
    context_chunks = [doc.page_content for doc in pagination.documents]
    context = "\n\n---\n\n".join(context_chunks)

    logger.info(
        "Page %d/%d — %d chunk(s) in context.",
        pagination.current_page,
        pagination.total_pages,
        len(context_chunks),
    )

    # ── 3. Build prompt ──────────────────────────────────────────────
    prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"━━━ RETRIEVED CONTEXT (Page {pagination.current_page}/{pagination.total_pages}) ━━━\n"
        f"{context}\n\n"
        f"━━━ USER QUESTION ━━━\n"
        f"{query}"
    )

    # ── 4. Generate ──────────────────────────────────────────────────
    answer = generate_answer(prompt)

    return RAGResponse(
        answer=answer,
        page=pagination.current_page,
        total_pages=pagination.total_pages,
        context_chunks=context_chunks,
    )
