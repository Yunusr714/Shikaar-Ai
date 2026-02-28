"""
Semantic retriever module.

Provides a singleton ChromaDB-backed retriever so the embedding model
and vector store are loaded exactly *once* across the application
lifetime (used by both Streamlit direct calls and FastAPI requests).
"""

import logging
from typing import Optional

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.vectorstores import VectorStoreRetriever

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# ── Singleton instances ─────────────────────────────────────────────────
_retriever: Optional[VectorStoreRetriever] = None


def load_retriever() -> VectorStoreRetriever:
    """Return a lazily-initialised singleton retriever.

    The embedding model and ChromaDB connection are created on the first
    call and reused for all subsequent calls.

    Returns:
        A LangChain ``VectorStoreRetriever`` backed by ChromaDB.
    """
    global _retriever
    if _retriever is not None:
        return _retriever

    settings = get_settings()

    logger.info(
        "Loading embedding model '%s' and vector DB from '%s'…",
        settings.EMBEDDING_MODEL,
        settings.VECTOR_DB_DIR,
    )

    embedding = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)

    vectordb = Chroma(
        persist_directory=settings.VECTOR_DB_DIR,
        embedding_function=embedding,
    )

    _retriever = vectordb.as_retriever(
        search_kwargs={"k": settings.RETRIEVER_K},
    )

    logger.info(
        "Retriever ready (k=%d, vectors=%d).",
        settings.RETRIEVER_K,
        vectordb._collection.count(),
    )
    return _retriever
