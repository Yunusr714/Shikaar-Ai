"""
RAG chain — orchestrates retrieval, pagination, and LLM generation.

This module is the single entry-point consumed by both the Streamlit
testing interface (direct call) and the FastAPI chat endpoint.
"""

import json
import logging
from dataclasses import dataclass, field
from typing import List

from app.rag.retriever import load_retriever
from app.rag.pagination import paginate_results, PaginationResult
from app.llm.gemini import generate_answer
from app.prompts.system_prompt import SYSTEM_PROMPT

logger = logging.getLogger(__name__)


@dataclass
class StepInfo:
    """A single step in a flow diagram."""

    icon: str = ""
    title: str = ""
    description: str = ""


@dataclass
class RAGResponse:
    """Structured response from the RAG pipeline."""

    answer: str = ""
    page: int = 1
    total_pages: int = 1
    context_chunks: List[str] = field(default_factory=list)
    steps: List[StepInfo] = field(default_factory=list)


def _format_history(history: list[dict]) -> str:
    """Format conversation history for the prompt."""
    if not history:
        return ""
    lines = []
    for msg in history[-6:]:  # Keep last 3 pairs (6 messages)
        role = "User" if msg.get("role") == "user" else "Assistant"
        lines.append(f"{role}: {msg['content']}")
    return "\n".join(lines)


def _clean_answer_text(text: str) -> str:
    """Strip any residual markdown formatting from the answer, keeping bullets."""
    import re

    # If the text itself looks like JSON, try to extract "answer" from it
    if text.strip().startswith("{"):
        try:
            nested = json.loads(text.strip())
            if isinstance(nested, dict) and "answer" in nested:
                text = nested["answer"]
        except (json.JSONDecodeError, TypeError):
            pass

    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)  # bold
    text = re.sub(r"\*(.+?)\*", r"\1", text)  # italic
    text = re.sub(r"__(.+?)__", r"\1", text)
    text = re.sub(r"_(.+?)_", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)  # headers
    # Keep • bullets, only strip markdown-style - bullets and convert to •
    text = re.sub(r"^\s*[-]\s+", "• ", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+[.)]\s+", "• ", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _parse_structured_response(raw: str) -> tuple[str, list[StepInfo]]:
    """Parse the LLM JSON response into answer + steps."""
    import re

    text = raw.strip()

    # Remove markdown code fences if present
    if text.startswith("```"):
        first_newline = text.find("\n")
        if first_newline != -1:
            text = text[first_newline + 1 :]
        if text.endswith("```"):
            text = text[:-3].strip()

    # Try direct JSON parse
    data = None
    try:
        data = json.loads(text)
    except (json.JSONDecodeError, TypeError):
        # Fallback: try to find JSON object in the text using regex
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group())
            except (json.JSONDecodeError, TypeError):
                pass

    if data is None or not isinstance(data, dict):
        logger.warning("No valid JSON found in response.")
        return _clean_answer_text(raw), []

    # Handle nested "answer" — if the answer is itself a dict, extract it
    answer_raw = data.get("answer", raw)
    if isinstance(answer_raw, dict):
        answer_raw = answer_raw.get("answer", str(answer_raw))

    answer = _clean_answer_text(str(answer_raw))

    steps_raw = data.get("steps", [])
    steps = []
    for s in steps_raw:
        if isinstance(s, dict) and s.get("title"):
            steps.append(
                StepInfo(
                    icon=s.get("icon", "ellipse"),
                    title=s.get("title", ""),
                    description=s.get("description", ""),
                )
            )
    return answer, steps


def rag_pipeline(
    query: str,
    page: int = 1,
    page_size: int | None = None,
    history: list[dict] | None = None,
) -> RAGResponse:
    """Run the full Retrieval-Augmented Generation pipeline.

    1. Retrieve semantically relevant documents from the vector store.
    2. Paginate the results to the requested page.
    3. Build a prompt with system instructions + history + paginated context.
    4. Send the prompt to Gemini and return a structured response.

    Args:
        query: The user's natural-language question.
        page: 1-based page number for context pagination.
        page_size: Optional override for documents per page.
        history: Optional list of previous messages for conversation memory.

    Returns:
        A ``RAGResponse`` with the generated answer, steps, and metadata.
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
    history_text = _format_history(history or [])
    history_section = (
        f"\n━━━ CONVERSATION HISTORY ━━━\n{history_text}\n" if history_text else ""
    )

    prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        f"━━━ RETRIEVED CONTEXT (Page {pagination.current_page}/{pagination.total_pages}) ━━━\n"
        f"{context}\n"
        f"{history_section}\n"
        f"━━━ USER QUESTION ━━━\n"
        f"{query}\n\n"
        f"Respond with valid JSON only."
    )

    # ── 4. Generate ──────────────────────────────────────────────────
    raw_answer = generate_answer(prompt)
    answer, steps = _parse_structured_response(raw_answer)

    return RAGResponse(
        answer=answer,
        page=pagination.current_page,
        total_pages=pagination.total_pages,
        context_chunks=context_chunks,
        steps=steps,
    )
