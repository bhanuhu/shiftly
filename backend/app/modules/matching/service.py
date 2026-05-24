import json
import uuid

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.bookings.models import Booking
from app.modules.bookings.repository import BookingRepository
from app.shared.enums import BookingStatus
from app.websocket.manager import websocket_manager


class MatchingService:
    def __init__(self, session: AsyncSession, redis: Redis):
        self.session = session
        self.redis = redis
        self.bookings = BookingRepository(session)

    async def find_driver(self, booking: Booking, radius_km: int = 10) -> list[str]:
        booking.status = BookingStatus.SEARCHING_DRIVER
        await self.redis.setex(f"booking:active:{booking.id}", 3600, json.dumps({"status": booking.status.value}))
        nearby = await self.redis.geosearch(
            "geo:drivers",
            longitude=float(booking.pickup_lng),
            latitude=float(booking.pickup_lat),
            radius=radius_km,
            unit="km",
            sort="ASC",
            count=10,
        )
        for driver_id in nearby:
            await websocket_manager.send_to_driver(
                str(driver_id),
                {
                    "event": "new_booking_request",
                    "booking_id": str(booking.id),
                    "pickup_address": booking.pickup_address,
                    "drop_address": booking.drop_address,
                    "estimated_fare": str(booking.estimated_fare),
                },
            )
        await self.session.commit()
        return [str(driver_id) for driver_id in nearby]

    async def accept_driver(self, booking_id: uuid.UUID, driver_id: uuid.UUID) -> Booking:
        lock_key = f"lock:booking:{booking_id}"
        acquired = await self.redis.set(lock_key, str(driver_id), nx=True, ex=30)
        if not acquired:
            raise AppException("BOOKING_ALREADY_LOCKED", "Another driver is already accepting this booking", 409)
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        if booking.assigned_driver_id and booking.assigned_driver_id != driver_id:
            raise AppException("BOOKING_ALREADY_ASSIGNED", "Booking is already assigned", 409)
        booking.assigned_driver_id = driver_id
        booking.status = BookingStatus.DRIVER_ASSIGNED
        await self.redis.setex(
            f"booking:active:{booking.id}", 86400, json.dumps({"status": booking.status.value, "driver_id": str(driver_id)})
        )
        await self.session.commit()
        await websocket_manager.broadcast_booking(
            str(booking.id), {"event": "booking_accepted", "booking_id": str(booking.id), "driver_id": str(driver_id)}
        )
        return booking

    async def compatible_orders(self, booking: Booking) -> list[dict]:
        # Production extension point: replace with route-polyline and vehicle-capacity optimization.
        nearby = await self.redis.geosearch(
            "geo:drivers",
            longitude=float(booking.pickup_lng),
            latitude=float(booking.pickup_lat),
            radius=3,
            unit="km",
            count=5,
        )
        return [{"driver_id": str(driver_id), "max_delay_minutes": 15, "score": 0.82} for driver_id in nearby]

    async def shared_options(self, booking_id: uuid.UUID) -> list[dict]:
        booking = await self.bookings.get_by_id(booking_id)
        if not booking:
            raise AppException("BOOKING_NOT_FOUND", "Booking not found", 404)
        return await self.compatible_orders(booking)
