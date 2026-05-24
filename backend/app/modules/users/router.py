from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.core.dependencies import get_current_user
from app.modules.users.models import User
from app.modules.users.schemas import UserResponse, UserUpdateRequest
from app.modules.users.service import UserService
from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_me(current_user: User = Depends(get_current_user)):
    return ApiResponse(message="Current user fetched", data=UserResponse.model_validate(current_user))


@router.patch("/me", response_model=ApiResponse[UserResponse])
async def update_me(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    user = await UserService(db).update_me(current_user, payload.name)
    return ApiResponse(message="Profile updated", data=UserResponse.model_validate(user))
