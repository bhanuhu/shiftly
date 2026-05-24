import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.models import User
from app.shared.repository import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def __init__(self, session: AsyncSession):
        super().__init__(session)

    async def get_by_phone(self, phone: str) -> User | None:
        result = await self.session.execute(select(User).where(User.phone == phone))
        return result.scalar_one_or_none()

    async def update_name(self, user_id: uuid.UUID, name: str | None) -> User:
        user = await self.get_by_id(user_id)
        user.name = name
        await self.session.flush()
        await self.session.refresh(user)
        return user
