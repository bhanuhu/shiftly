import uuid

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.bookings.models import Booking
from app.modules.bookings.repository import BookingRepository
from app.modules.drivers.repository import DriverRepository
from app.modules.matching.service import MatchingService
from app.modules.users.models import User
from app.shared.enums import BookingStatus
from app.websocket.manager import websocket_manager


class BookingService:
    def __init__(self, session: AsyncSession, redis: Redis):
        self.session = session
        self.redis = redis
        self.bookings = BookingRepository(session)
        self.drivers = DriverRepository(session)

    async def _driver_booking(self, user: User, booking_id: uuid.UUID) -> tuple[Booking, uuid.UUID]:
        driver = await self.drivers.get_by_user_id(user.id)
        if not driver:
            raise AppException("DRIVER_NOT_FOUND", "Driver profile not found", 404)
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        return booking, driver.id

    async def accept(self, user: User, booking_id: uuid.UUID) -> Booking:
        _, driver_id = await self._driver_booking(user, booking_id)
        return await MatchingService(self.session, self.redis).accept_driver(booking_id, driver_id)

    async def reject(self, user: User, booking_id: uuid.UUID) -> None:
        booking, driver_id = await self._driver_booking(user, booking_id)
        await self.redis.sadd(f"booking:rejected:{booking.id}", str(driver_id))
        await MatchingService(self.session, self.redis).find_driver(booking)

    async def transition(self, user: User, booking_id: uuid.UUID, status: BookingStatus, event: str) -> Booking:
        booking, driver_id = await self._driver_booking(user, booking_id)
        if booking.assigned_driver_id != driver_id:
            raise AppException("BOOKING_NOT_ASSIGNED_TO_DRIVER", "Booking is not assigned to this driver", 403)
        booking.status = status
        if status == BookingStatus.DELIVERED:
            booking.final_fare = booking.estimated_fare
        await self.session.commit()
        await websocket_manager.broadcast_booking(str(booking.id), {"event": event, "booking_id": str(booking.id), "status": status.value})
        return booking

    async def accept_shared(self, user: User, booking_id: uuid.UUID) -> Booking:
        return await self.accept(user, booking_id)

    async def compatible_orders(self, booking_id: uuid.UUID) -> list[dict]:
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        return await MatchingService(self.session, self.redis).compatible_orders(booking)
