import uuid

from sqlalchemy import select

from app.modules.customers.models import Customer
from app.shared.repository import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    model = Customer

    async def get_by_user_id(self, user_id: uuid.UUID) -> Customer | None:
        result = await self.session.execute(select(Customer).where(Customer.user_id == user_id))
        return result.scalar_one_or_none()
