# SHIFTLY Backend

Production-grade modular monolith backend for a logistics marketplace.

## Run locally

```bash
cp .env.example .env
docker compose up --build
```

API: `http://localhost:8000`

Docs: `http://localhost:8000/docs`

## Architecture

Routers call services, services coordinate repositories, repositories own database access. DTOs are split between SQLAlchemy models and Pydantic request/response schemas. Redis stores OTPs, online driver state, GEO driver locations, active bookings, and transient workflow locks.

## Migrations

```bash
alembic revision --autogenerate -m "change"
alembic upgrade head
```
