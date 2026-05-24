import uuid

from sqlalchemy import select

from app.modules.payments.models import Payment
from app.shared.repository import BaseRepository


class PaymentRepository(BaseRepository[Payment]):
    model = Payment

    async def list_for_bookings(self, booking_ids: list[uuid.UUID]) -> list[Payment]:
        result = await self.session.execute(select(Payment).where(Payment.booking_id.in_(booking_ids)))
        return list(result.scalars().all())

    async def get_by_order_id(self, order_id: str) -> Payment | None:
        result = await self.session.execute(select(Payment).where(Payment.provider_order_id == order_id))
        return result.scalar_one_or_none()
