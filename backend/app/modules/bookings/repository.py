import uuid

from sqlalchemy import select

from app.modules.bookings.models import Booking
from app.shared.enums import BookingStatus
from app.shared.repository import BaseRepository


class BookingRepository(BaseRepository[Booking]):
    model = Booking

    async def list_by_customer(self, customer_id: uuid.UUID) -> list[Booking]:
        result = await self.session.execute(select(Booking).where(Booking.customer_id == customer_id).order_by(Booking.created_at.desc()))
        return list(result.scalars().all())

    async def list_active_for_driver(self, driver_id: uuid.UUID) -> list[Booking]:
        result = await self.session.execute(
            select(Booking).where(
                Booking.assigned_driver_id == driver_id,
                Booking.status.in_(
                    [BookingStatus.DRIVER_ASSIGNED, BookingStatus.DRIVER_ARRIVING, BookingStatus.PICKED_UP, BookingStatus.IN_TRANSIT]
                ),
            )
        )
        return list(result.scalars().all())
