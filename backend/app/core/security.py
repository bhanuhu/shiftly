import random
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.core.config import get_settings
from app.core.exceptions import AppException
from app.shared.enums import UserRole

settings = get_settings()


def generate_otp() -> str:
    if settings.otp_dev_override and settings.environment in {"local", "test"}:
        return settings.otp_dev_override
    lower = 10 ** (settings.otp_length - 1)
    upper = (10**settings.otp_length) - 1
    return str(random.randint(lower, upper))


def create_token(subject: uuid.UUID, role: UserRole, expires_delta: timedelta, token_type: str) -> str:
    expire = datetime.now(UTC) + expires_delta
    payload: dict[str, Any] = {"sub": str(subject), "role": role.value, "type": token_type, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret_key.get_secret_value(), algorithm=settings.jwt_algorithm)


def create_access_token(subject: uuid.UUID, role: UserRole) -> str:
    return create_token(subject, role, timedelta(minutes=settings.access_token_expire_minutes), "access")


def create_refresh_token(subject: uuid.UUID, role: UserRole) -> str:
    return create_token(subject, role, timedelta(days=settings.refresh_token_expire_days), "refresh")


def decode_token(token: str, expected_type: str = "access") -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret_key.get_secret_value(), algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise AppException("INVALID_TOKEN", "Invalid or expired token", 401) from exc
    if payload.get("type") != expected_type:
        raise AppException("INVALID_TOKEN_TYPE", "Invalid token type", 401)
    return payload
