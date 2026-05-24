from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

from app.core.config import get_settings
from app.core.exceptions import AppException, app_exception_handler, http_exception_handler, validation_exception_handler
from app.core.logging import configure_logging
from app.core.middleware import RequestContextMiddleware
from app.core.redis import close_redis
from app.modules.admin.router import router as admin_router
from app.modules.analytics.router import router as analytics_router
from app.modules.auth.router import router as auth_router
from app.modules.bookings.router import router as bookings_router
from app.modules.customers.router import router as customers_router
from app.modules.drivers.router import router as drivers_router
from app.modules.matching.router import router as matching_router
from app.modules.payments.router import router as payments_router
from app.modules.users.router import router as users_router
from app.websocket.router import router as websocket_router

settings = get_settings()
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.rate_limit_default])


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await close_redis()


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title=settings.app_name, debug=settings.debug, version="1.0.0", lifespan=lifespan)
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)

    app.add_middleware(SlowAPIMiddleware)
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.cors_origins],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    prefix = settings.api_v1_prefix
    app.include_router(auth_router, prefix=prefix)
    app.include_router(users_router, prefix=prefix)
    app.include_router(drivers_router, prefix=prefix)
    app.include_router(customers_router, prefix=prefix)
    app.include_router(bookings_router, prefix=prefix)
    app.include_router(matching_router, prefix=prefix)
    app.include_router(payments_router, prefix=prefix)
    app.include_router(admin_router, prefix=prefix)
    app.include_router(analytics_router, prefix=prefix)
    app.include_router(websocket_router)

    @app.get("/health")
    async def health():
        return {"success": True, "message": "SHIFTLY backend healthy", "data": {"status": "ok"}}

    return app


async def _rate_limit_handler(_, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "error": {"code": "RATE_LIMIT_EXCEEDED", "message": str(exc.detail)}},
    )


app = create_app()
