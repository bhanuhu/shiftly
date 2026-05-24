import uuid

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_roles
from app.core.redis import get_redis
from app.modules.bookings.service import BookingService
from app.modules.customers.schemas import BookingResponse
from app.modules.users.models import User
from app.shared.enums import BookingStatus, UserRole
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/{booking_id}/accept", response_model=ApiResponse[BookingResponse])
async def accept_booking(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await BookingService(db, redis).accept(user, booking_id)
    return ApiResponse(message="Trip accepted", data=BookingResponse.model_validate(booking))


@router.post("/{booking_id}/reject", response_model=ApiResponse[dict])
async def reject_booking(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    await BookingService(db, redis).reject(user, booking_id)
    return ApiResponse(message="Trip rejected", data={})


@router.post("/{booking_id}/arrived", response_model=ApiResponse[BookingResponse])
async def arrived(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await BookingService(db, redis).transition(user, booking_id, BookingStatus.DRIVER_ARRIVING, "driver_arrived")
    return ApiResponse(message="Driver arrived", data=BookingResponse.model_validate(booking))


@router.post("/{booking_id}/start", response_model=ApiResponse[BookingResponse])
async def start_trip(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await BookingService(db, redis).transition(user, booking_id, BookingStatus.IN_TRANSIT, "trip_started")
    return ApiResponse(message="Trip started", data=BookingResponse.model_validate(booking))


@router.post("/{booking_id}/deliver", response_model=ApiResponse[BookingResponse])
async def deliver_trip(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await BookingService(db, redis).transition(user, booking_id, BookingStatus.DELIVERED, "trip_completed")
    return ApiResponse(message="Trip completed", data=BookingResponse.model_validate(booking))


@router.post("/{booking_id}/accept-shared", response_model=ApiResponse[BookingResponse])
async def accept_shared(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.DRIVER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await BookingService(db, redis).accept_shared(user, booking_id)
    return ApiResponse(message="Shared trip accepted", data=BookingResponse.model_validate(booking))


@router.get("/{booking_id}/compatible-orders", response_model=ApiResponse[list[dict]])
async def compatible_orders(booking_id: uuid.UUID, db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)):
    orders = await BookingService(db, redis).compatible_orders(booking_id)
    return ApiResponse(message="Compatible orders fetched", data=orders)
