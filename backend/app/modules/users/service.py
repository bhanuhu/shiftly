from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.models import User
from app.modules.users.repository import UserRepository


class UserService:
    def __init__(self, session: AsyncSession):
        self.users = UserRepository(session)
        self.session = session

    async def update_me(self, user: User, name: str | None) -> User:
        updated = await self.users.update_name(user.id, name)
        await self.session.commit()
        return updated
