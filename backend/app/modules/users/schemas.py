import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.shared.enums import UserRole
from app.shared.schemas import ORMModel


class UserResponse(ORMModel):
    id: uuid.UUID
    phone: str
    name: str | None
    role: UserRole
    is_active: bool
    created_at: datetime


class UserUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
