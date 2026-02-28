"""
User profile API — view and update the authenticated user's profile.
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.api.deps import CurrentUserDep
from app.db.database import SessionDep

router = APIRouter(prefix="/api/users", tags=["users"])


# ── Schemas ──────────────────────────────────────────────────────────────
class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    avatar: str
    rating: float
    membership_tier: str
    location: str
    total_rides: int
    joined_date: str


class UserUpdateRequest(BaseModel):
    name: str | None = None
    phone: str | None = None
    avatar: str | None = None
    location: str | None = None


# ── Endpoints ────────────────────────────────────────────────────────────
@router.get("/me")
def get_my_profile(current_user: CurrentUserDep) -> UserProfileResponse:
    """Return the authenticated user's profile."""
    return UserProfileResponse(
        id=current_user.id,  # type: ignore[arg-type]
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        avatar=current_user.avatar,
        rating=current_user.rating,
        membership_tier=current_user.membership_tier,
        location=current_user.location,
        total_rides=current_user.total_rides,
        joined_date=current_user.created_at.strftime("%b %Y"),
    )


@router.put("/me")
def update_my_profile(
    body: UserUpdateRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> UserProfileResponse:
    """Update fields on the authenticated user's profile."""
    for field_name, value in body.model_dump(exclude_unset=True).items():
        setattr(current_user, field_name, value)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return UserProfileResponse(
        id=current_user.id,  # type: ignore[arg-type]
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        avatar=current_user.avatar,
        rating=current_user.rating,
        membership_tier=current_user.membership_tier,
        location=current_user.location,
        total_rides=current_user.total_rides,
        joined_date=current_user.created_at.strftime("%b %Y"),
    )
