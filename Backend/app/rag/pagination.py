"""
Pagination module for retrieval results.

Slices a list of retrieved documents into pages so that only a
manageable subset of context is sent to the LLM per request.
"""

import math
from dataclasses import dataclass, field
from typing import List

from langchain_core.documents import Document

from app.core.config import get_settings


@dataclass
class PaginationResult:
    """Holds a single page of documents plus pagination metadata."""

    documents: List[Document] = field(default_factory=list)
    current_page: int = 1
    page_size: int = 3
    total_documents: int = 0
    total_pages: int = 0


def paginate_results(
    documents: List[Document],
    page: int = 1,
    page_size: int | None = None,
) -> PaginationResult:
    """Return a specific page of documents with metadata.

    Args:
        documents: The full list of retrieved documents.
        page: 1-based page number to return.
        page_size: Number of documents per page (defaults to
                   ``Settings.DEFAULT_PAGE_SIZE``).

    Returns:
        A ``PaginationResult`` containing the sliced documents and
        pagination metadata.
    """
    if page_size is None:
        page_size = get_settings().DEFAULT_PAGE_SIZE

    total = len(documents)
    total_pages = max(1, math.ceil(total / page_size))

    # Clamp page to valid range
    page = max(1, min(page, total_pages))

    start = (page - 1) * page_size
    end = start + page_size

    return PaginationResult(
        documents=documents[start:end],
        current_page=page,
        page_size=page_size,
        total_documents=total,
        total_pages=total_pages,
    )
