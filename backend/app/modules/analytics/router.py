from fastapi import APIRouter

from app.shared.schemas import ApiResponse

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/health", response_model=ApiResponse[dict])
async def analytics_health():
    return ApiResponse(message="Analytics module ready", data={"ready": True})
