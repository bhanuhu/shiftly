from collections.abc import AsyncGenerator

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


from app.shared import models_imports  # noqa: E402,F401

settings = get_settings()
engine = create_async_engine(
    settings.database_url,
    pool_pre_ping=True,
    poolclass=pool.NullPool,
    connect_args={"prepared_statement_cache_size": 0, "statement_cache_size": 0},
)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
