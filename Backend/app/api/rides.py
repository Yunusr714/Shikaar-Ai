"""
Ride history API — list and create ride records for the authenticated user.
"""

from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from sqlmodel import select, col, func
from typing import Annotated

from app.api.deps import CurrentUserDep
from app.db.database import SessionDep
from app.db.models import RideHistory

router = APIRouter(prefix="/api/rides", tags=["rides"])


# ── Schemas ──────────────────────────────────────────────────────────────
class RideResponse(BaseModel):
    id: int
    pickup: str
    drop: str
    date: str
    fare: str
    status: str
    vehicle: str


class RideHistoryListResponse(BaseModel):
    rides: list[RideResponse]
    total: int
    page: int
    page_size: int


class CreateRideRequest(BaseModel):
    pickup: str = Field(min_length=1)
    drop: str = Field(min_length=1)
    date: str = Field(min_length=1)
    fare: str = Field(min_length=1)
    status: str = Field(default="completed")
    vehicle: str = Field(default="Shikaar Sedan")


# ── Endpoints ────────────────────────────────────────────────────────────
@router.get("/history")
def get_ride_history(
    current_user: CurrentUserDep,
    session: SessionDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 20,
) -> RideHistoryListResponse:
    """Return paginated ride history for the authenticated user."""
    total = session.exec(
        select(func.count())
        .select_from(RideHistory)
        .where(RideHistory.user_id == current_user.id)
    ).one()

    rides = session.exec(
        select(RideHistory)
        .where(RideHistory.user_id == current_user.id)
        .order_by(col(RideHistory.created_at).desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return RideHistoryListResponse(
        rides=[
            RideResponse(
                id=r.id,  # type: ignore[arg-type]
                pickup=r.pickup,
                drop=r.drop,
                date=r.date,
                fare=r.fare,
                status=r.status,
                vehicle=r.vehicle,
            )
            for r in rides
        ],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("/history", status_code=201)
def create_ride(
    body: CreateRideRequest,
    current_user: CurrentUserDep,
    session: SessionDep,
) -> RideResponse:
    """Record a new ride in history for the authenticated user."""
    ride = RideHistory(
        user_id=current_user.id,  # type: ignore[arg-type]
        pickup=body.pickup,
        drop=body.drop,
        date=body.date,
        fare=body.fare,
        status=body.status,
        vehicle=body.vehicle,
    )
    session.add(ride)
    session.commit()
    session.refresh(ride)

    # Increment total rides on user
    current_user.total_rides += 1
    session.add(current_user)
    session.commit()

    return RideResponse(
        id=ride.id,  # type: ignore[arg-type]
        pickup=ride.pickup,
        drop=ride.drop,
        date=ride.date,
        fare=ride.fare,
        status=ride.status,
        vehicle=ride.vehicle,
    )
