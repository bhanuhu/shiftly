from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "SHIFTLY"
    environment: Literal["local", "test", "staging", "production"] = "local"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str = "postgresql+asyncpg://shiftly:shiftly@postgres:5432/shiftly"
    redis_url: str = "redis://redis:6379/0"

    jwt_secret_key: SecretStr = Field(default=SecretStr("change-me-in-production"))
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30

    otp_ttl_seconds: int = 300
    otp_length: int = 6
    otp_dev_override: str | None = "123456"

    admin_login: str = "admin@shiftly.in"
    admin_password: SecretStr = Field(default=SecretStr("password123"))
    admin_phone: str = "+910000000000"
    admin_name: str = "SHIFTLY Admin"

    rate_limit_default: str = "100/minute"

    aws_access_key_id: str | None = None
    aws_secret_access_key: SecretStr | None = None
    aws_region: str = "ap-south-1"
    s3_bucket_name: str | None = None
    cloudinary_url: str | None = None

    cors_origins: list[AnyHttpUrl] | list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
    ]

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if value.startswith("postgres://"):
            return value.replace("postgres://", "postgresql+asyncpg://", 1)
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> str | list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
