from pydantic import BaseModel, Field

from app.modules.users.schemas import UserResponse
from app.shared.enums import UserRole


class SendOtpRequest(BaseModel):
    phone: str = Field(min_length=8, max_length=20)
    role: UserRole = UserRole.CUSTOMER


class VerifyOtpRequest(BaseModel):
    phone: str = Field(min_length=8, max_length=20)
    otp: str = Field(min_length=4, max_length=8)
    name: str | None = Field(default=None, max_length=120)
    role: UserRole = UserRole.CUSTOMER


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class AdminLoginRequest(BaseModel):
    phone_or_email: str = Field(min_length=3, max_length=120)
    password: str = Field(min_length=6, max_length=128)
