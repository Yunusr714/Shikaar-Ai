"""
SQLModel table definitions for the Shikaar AI database.
"""

from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """Registered application user."""

    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=120)
    email: str = Field(max_length=255, unique=True, index=True)
    phone: str = Field(default="", max_length=20)
    hashed_password: str
    avatar: str = Field(default="")
    rating: float = Field(default=5.0)
    membership_tier: str = Field(default="Standard")
    location: str = Field(default="")
    total_rides: int = Field(default=0)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )


class RideHistory(SQLModel, table=True):
    """A completed or cancelled ride record."""

    __tablename__ = "ride_history"

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    pickup: str
    drop: str  # noqa: A003 – intentional to match frontend field name
    date: str = Field(description="Human-readable date string shown in UI")
    fare: str = Field(description="Formatted fare string, e.g. '$25.50'")
    status: str = Field(default="completed")  # completed | cancelled
    vehicle: str = Field(default="Shikaar Sedan")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )
