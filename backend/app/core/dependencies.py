import uuid
from collections.abc import Callable

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.exceptions import AppException, ForbiddenException
from app.core.security import decode_token
from app.modules.users.models import User
from app.modules.users.repository import UserRepository
from app.shared.enums import UserRole

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db_session),
) -> User:
    if credentials is None:
        raise AppException("NOT_AUTHENTICATED", "Authentication required", 401)
    payload = decode_token(credentials.credentials)
    user_id = uuid.UUID(payload["sub"])
    user = await UserRepository(db).get_by_id(user_id)
    if not user or not user.is_active:
        raise AppException("USER_INACTIVE", "User is inactive or does not exist", 401)
    return user


def require_roles(*roles: UserRole) -> Callable:
    async def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise ForbiddenException()
        return current_user

    return dependency
