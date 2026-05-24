import uuid

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.exceptions import AppException
from app.core.redis import get_redis
from app.modules.bookings.repository import BookingRepository
from app.modules.matching.service import MatchingService
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/matching", tags=["matching"])


@router.post("/find-driver", response_model=ApiResponse[dict])
async def find_driver(booking_id: uuid.UUID, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    booking = await BookingRepository(db).get_by_id(booking_id)
    if not booking:
        raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
    drivers = await MatchingService(db, redis).find_driver(booking)
    return ApiResponse(message="Driver search started", data={"drivers": drivers})


@router.get("/shared-options/{booking_id}", response_model=ApiResponse[list[dict]])
async def shared_options(booking_id: uuid.UUID, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    options = await MatchingService(db, redis).shared_options(booking_id)
    return ApiResponse(message="Shared delivery options fetched", data=options)
