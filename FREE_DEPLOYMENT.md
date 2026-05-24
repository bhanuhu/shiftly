# SHIFTLY Free Deployment Setup

This setup keeps the first live demo as close to free as possible:

- Backend: Render free web service, or Railway trial/free tier
- Postgres: Supabase free Postgres
- Redis: Upstash free Redis
- Admin panel: Vercel free hosting
- Driver app: Expo local/dev build pointing to the live backend

For real production traffic, expect to move to paid plans later. Free services can sleep, throttle, or pause.

## 1. Create Free Postgres

Use Supabase and create a new project.

Copy the database connection string and use it as:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
```

The backend automatically converts `postgresql://` or `postgres://` into the async SQLAlchemy format it needs.

## 2. Create Free Redis

Use Upstash Redis and copy the Redis connection URL:

```env
REDIS_URL=rediss://default:PASSWORD@HOST.upstash.io:6379
```

This Redis instance is used for OTPs, online drivers, Redis GEO driver matching, active booking state, and WebSocket coordination.

## 3. Deploy Backend

Deploy `/Users/bhanuaggarwal/Desktop/shiftly/backend`.

Recommended backend settings:

```text
Root directory: backend
Runtime: Docker
Health check path: /health
```

Set these environment variables on the backend host:

```env
APP_NAME=SHIFTLY
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=<your-supabase-postgres-url>
REDIS_URL=<your-upstash-redis-url>
JWT_SECRET_KEY=<generate-a-long-random-secret>
OTP_DEV_OVERRIDE=
ADMIN_LOGIN=admin@shiftly.in
ADMIN_PASSWORD=<strong-password>
ADMIN_PHONE=+910000000000
ADMIN_NAME=SHIFTLY Admin
CORS_ORIGINS=https://your-admin-domain.vercel.app,http://localhost:3000
RATE_LIMIT_DEFAULT=100/minute
```

The Docker image runs:

```sh
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
```

So migrations are applied automatically before the API starts.

## 4. Deploy Admin Panel

Deploy `/Users/bhanuaggarwal/Desktop/shiftly/admin-panel` to Vercel.

Set:

```env
NEXT_PUBLIC_API_BASE_URL=https://shiftly-u6zd.onrender.com
NEXT_PUBLIC_WS_URL=wss://shiftly-u6zd.onrender.com
```

After Vercel gives you the admin URL, add it to the backend `CORS_ORIGINS`.

## 5. Connect Driver App

In `/Users/bhanuaggarwal/Desktop/shiftly/shiftly-driver/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://shiftly-u6zd.onrender.com
EXPO_PUBLIC_WS_URL=wss://shiftly-u6zd.onrender.com
```

Then restart Expo so it picks up the env values.

## 6. Smoke Test

Backend:

```sh
curl https://your-backend-domain/health
```

Admin:

```text
Open https://your-admin-domain.vercel.app/login
Login with ADMIN_LOGIN and ADMIN_PASSWORD.
```

Driver app:

```text
Send OTP, verify OTP, register driver, then check the admin panel drivers page.
```

## Notes

- Free Render services can sleep, so first requests may be slow.
- Do not keep `OTP_DEV_OVERRIDE=123456` in a public production deployment.
- Real phone OTP delivery still needs an SMS provider.
- Keep `JWT_SECRET_KEY`, `ADMIN_PASSWORD`, database URL, and Redis URL private.
