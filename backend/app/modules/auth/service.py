from uuid import UUID

from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.exceptions import AppException
from app.core.security import create_access_token, create_refresh_token, decode_token, generate_otp
from app.modules.auth.schemas import TokenPair
from app.modules.users.models import User
from app.modules.users.repository import UserRepository
from app.modules.users.schemas import UserResponse
from app.shared.enums import UserRole


class AuthService:
    def __init__(self, session: AsyncSession, redis: Redis):
        self.session = session
        self.redis = redis
        self.users = UserRepository(session)
        self.settings = get_settings()

    async def send_otp(self, phone: str) -> str:
        otp = generate_otp()
        await self.redis.setex(f"otp:{phone}", self.settings.otp_ttl_seconds, otp)
        return otp

    async def verify_otp(self, phone: str, otp: str, role: UserRole, name: str | None) -> TokenPair:
        expected = await self.redis.get(f"otp:{phone}")
        if not expected or expected != otp:
            raise AppException("INVALID_OTP", "Invalid or expired OTP", 401)
        user = await self.users.get_by_phone(phone)
        if user is None:
            user = await self.users.add(User(phone=phone, name=name, role=role))
        elif name and not user.name:
            user.name = name
        await self.redis.delete(f"otp:{phone}")
        await self.session.commit()
        return self._tokens_for(user)

    async def admin_login(self, phone_or_email: str, password: str) -> TokenPair:
        valid_login = phone_or_email in {self.settings.admin_login, self.settings.admin_phone}
        valid_password = password == self.settings.admin_password.get_secret_value()
        if not valid_login or not valid_password:
            raise AppException("INVALID_ADMIN_CREDENTIALS", "Invalid admin credentials", 401)

        user = await self.users.get_by_phone(self.settings.admin_phone)
        if user is None:
            user = await self.users.add(
                User(phone=self.settings.admin_phone, name=self.settings.admin_name, role=UserRole.ADMIN)
            )
        else:
            user.name = user.name or self.settings.admin_name
            user.role = UserRole.ADMIN
            user.is_active = True
        await self.session.commit()
        return self._tokens_for(user)

    async def refresh(self, refresh_token: str) -> TokenPair:
        payload = decode_token(refresh_token, expected_type="refresh")
        if await self.redis.get(f"jwt:blacklist:{refresh_token}"):
            raise AppException("TOKEN_REVOKED", "Refresh token has been revoked", 401)
        user = await self.users.get_by_id(UUID(payload["sub"]))
        if not user or not user.is_active:
            raise AppException("USER_INACTIVE", "User is inactive or does not exist", 401)
        return self._tokens_for(user)

    async def logout(self, refresh_token: str) -> None:
        payload = decode_token(refresh_token, expected_type="refresh")
        await self.redis.setex(f"jwt:blacklist:{refresh_token}", self.settings.refresh_token_expire_days * 86400, payload["sub"])

    def _tokens_for(self, user: User) -> TokenPair:
        return TokenPair(
            access_token=create_access_token(user.id, user.role),
            refresh_token=create_refresh_token(user.id, user.role),
            user=UserResponse.model_validate(user),
        )
