"""
Database engine and session management.

Uses SQLModel with SQLite for lightweight, file-based storage.
"""

from pathlib import Path
from typing import Annotated, Iterator

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings

settings = get_settings()

_db_path = Path(settings.DATABASE_URL.replace("sqlite:///", ""))
_db_path.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    """Create all tables that don't already exist."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """Yield a request-scoped database session."""
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
