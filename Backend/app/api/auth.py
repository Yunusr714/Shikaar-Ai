"""
Authentication API — register and login.
"""

import logging

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import select

from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import SessionDep
from app.db.models import User

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ── Schemas ──────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(default="", max_length=20)
    password: str = Field(min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str


# ── Endpoints ────────────────────────────────────────────────────────────
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, session: SessionDep) -> AuthResponse:
    """Create a new user account and return a JWT."""
    existing = session.exec(select(User).where(User.email == body.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        name=body.name,
        email=body.email,
        phone=body.phone,
        hashed_password=hash_password(body.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    logger.info("Registered user id=%d email=%s", user.id, user.email)

    return AuthResponse(
        access_token=create_access_token(user.id),  # type: ignore[arg-type]
        user_id=user.id,  # type: ignore[arg-type]
        name=user.name,
    )


@router.post("/login")
def login(body: LoginRequest, session: SessionDep) -> AuthResponse:
    """Authenticate with email/password and return a JWT."""
    user = session.exec(select(User).where(User.email == body.email)).first()

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    logger.info("Login user id=%d", user.id)

    return AuthResponse(
        access_token=create_access_token(user.id),  # type: ignore[arg-type]
        user_id=user.id,  # type: ignore[arg-type]
        name=user.name,
    )
