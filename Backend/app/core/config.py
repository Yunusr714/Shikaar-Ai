"""
Application configuration module.

Loads settings from environment variables / .env file using pydantic-settings.
Uses lru_cache for singleton pattern to avoid re-reading .env on every call.
"""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# Resolve project root (Backend/) relative to this file
_PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Central application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(_PROJECT_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── LLM ──────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # ── Paths ────────────────────────────────────────────────────────────
    DATA_DIR: str = str(_PROJECT_ROOT / "data" / "cab_knowledge")
    VECTOR_DB_DIR: str = str(_PROJECT_ROOT / "vector_db")

    # ── Chunking ─────────────────────────────────────────────────────────
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 100

    # ── Retriever ────────────────────────────────────────────────────────
    RETRIEVER_K: int = 10
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # ── Pagination ───────────────────────────────────────────────────────
    DEFAULT_PAGE_SIZE: int = 3


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton instance of application settings."""
    return Settings()
