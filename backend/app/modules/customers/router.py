import uuid

from fastapi import APIRouter, Depends
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import require_roles
from app.core.redis import get_redis
from app.modules.customers.schemas import BookingCreateRequest, BookingResponse
from app.modules.customers.service import CustomerService
from app.modules.users.models import User
from app.shared.enums import UserRole
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/customers", tags=["customers"])


@router.post("/bookings", response_model=ApiResponse[BookingResponse])
async def create_booking(
    payload: BookingCreateRequest,
    user: User = Depends(require_roles(UserRole.CUSTOMER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await CustomerService(db, redis).create_booking(user, payload)
    return ApiResponse(message="Booking created", data=BookingResponse.model_validate(booking))


@router.get("/bookings/{booking_id}", response_model=ApiResponse[BookingResponse])
async def get_booking(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.CUSTOMER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await CustomerService(db, redis).get_booking(user, booking_id)
    return ApiResponse(message="Booking fetched", data=BookingResponse.model_validate(booking))


@router.get("/bookings", response_model=ApiResponse[list[BookingResponse]])
async def list_bookings(
    user: User = Depends(require_roles(UserRole.CUSTOMER)), db: AsyncSession = Depends(get_db_session), redis: Redis = Depends(get_redis)
):
    bookings = await CustomerService(db, redis).list_bookings(user)
    return ApiResponse(message="Bookings fetched", data=[BookingResponse.model_validate(b) for b in bookings])


@router.patch("/bookings/{booking_id}/cancel", response_model=ApiResponse[BookingResponse])
async def cancel_booking(
    booking_id: uuid.UUID,
    user: User = Depends(require_roles(UserRole.CUSTOMER)),
    db: AsyncSession = Depends(get_db_session),
    redis: Redis = Depends(get_redis),
):
    booking = await CustomerService(db, redis).cancel_booking(user, booking_id)
    return ApiResponse(message="Booking cancelled", data=BookingResponse.model_validate(booking))
