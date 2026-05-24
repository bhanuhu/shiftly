"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-23
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    user_role = postgresql.ENUM("driver", "customer", "admin", name="user_role", create_type=False)
    verification_status = postgresql.ENUM(
        "pending", "approved", "rejected", "suspended", name="verification_status", create_type=False
    )
    booking_type = postgresql.ENUM("express", "shared", name="booking_type", create_type=False)
    booking_status = postgresql.ENUM(
        "pending",
        "searching_driver",
        "driver_assigned",
        "driver_arriving",
        "picked_up",
        "in_transit",
        "delivered",
        "cancelled",
        name="booking_status",
        create_type=False,
    )
    payment_status = postgresql.ENUM("pending", "paid", "failed", "refunded", name="payment_status", create_type=False)
    payout_status = postgresql.ENUM("pending", "processing", "paid", "failed", name="payout_status", create_type=False)
    for enum in [user_role, verification_status, booking_type, booking_status, payment_status, payout_status]:
        enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=True),
        sa.Column("role", user_role, nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_phone"), "users", ["phone"], unique=True)
    op.create_table(
        "drivers",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("vehicle_type", sa.String(length=50), nullable=False),
        sa.Column("vehicle_number", sa.String(length=30), nullable=False),
        sa.Column("aadhaar_url", sa.String(length=500), nullable=True),
        sa.Column("license_url", sa.String(length=500), nullable=True),
        sa.Column("profile_photo", sa.String(length=500), nullable=True),
        sa.Column("verification_status", verification_status, nullable=False),
        sa.Column("online_status", sa.Boolean(), nullable=False),
        sa.Column("current_lat", sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column("current_lng", sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column("rating", sa.Numeric(precision=3, scale=2), nullable=False),
        sa.Column("total_trips", sa.Integer(), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("vehicle_number"),
    )
    op.create_index(op.f("ix_drivers_user_id"), "drivers", ["user_id"], unique=True)
    op.create_table(
        "customers",
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("default_address", sa.String(length=500), nullable=True),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_customers_user_id"), "customers", ["user_id"], unique=True)
    op.create_table(
        "bookings",
        sa.Column("customer_id", sa.UUID(), nullable=False),
        sa.Column("assigned_driver_id", sa.UUID(), nullable=True),
        sa.Column("booking_type", booking_type, nullable=False),
        sa.Column("status", booking_status, nullable=False),
        sa.Column("pickup_address", sa.Text(), nullable=False),
        sa.Column("pickup_lat", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("pickup_lng", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("drop_address", sa.Text(), nullable=False),
        sa.Column("drop_lat", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("drop_lng", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("item_type", sa.String(length=80), nullable=False),
        sa.Column("estimated_fare", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("final_fare", sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column("commission", sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["assigned_driver_id"], ["drivers.id"]),
        sa.ForeignKeyConstraint(["customer_id"], ["customers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_bookings_assigned_driver_id"), "bookings", ["assigned_driver_id"], unique=False)
    op.create_index(op.f("ix_bookings_customer_id"), "bookings", ["customer_id"], unique=False)
    op.create_table(
        "driver_location_history",
        sa.Column("driver_id", sa.UUID(), nullable=False),
        sa.Column("booking_id", sa.UUID(), nullable=True),
        sa.Column("lat", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("lng", sa.Numeric(precision=9, scale=6), nullable=False),
        sa.Column("recorded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["driver_id"], ["drivers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_driver_location_history_booking_id"), "driver_location_history", ["booking_id"], unique=False)
    op.create_index(op.f("ix_driver_location_history_driver_id"), "driver_location_history", ["driver_id"], unique=False)
    op.create_table(
        "driver_earnings",
        sa.Column("driver_id", sa.UUID(), nullable=False),
        sa.Column("booking_id", sa.UUID(), nullable=False),
        sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("payout_status", payout_status, nullable=False),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.ForeignKeyConstraint(["driver_id"], ["drivers.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_driver_earnings_booking_id"), "driver_earnings", ["booking_id"], unique=False)
    op.create_index(op.f("ix_driver_earnings_driver_id"), "driver_earnings", ["driver_id"], unique=False)
    op.create_table(
        "payments",
        sa.Column("booking_id", sa.UUID(), nullable=False),
        sa.Column("payment_status", payment_status, nullable=False),
        sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("method", sa.String(length=50), nullable=False),
        sa.Column("provider_order_id", sa.String(length=120), nullable=True),
        sa.Column("provider_payment_id", sa.String(length=120), nullable=True),
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["booking_id"], ["bookings.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_payments_booking_id"), "payments", ["booking_id"], unique=False)
    op.create_index(op.f("ix_payments_provider_order_id"), "payments", ["provider_order_id"], unique=False)
    op.create_index(op.f("ix_payments_provider_payment_id"), "payments", ["provider_payment_id"], unique=False)


def downgrade() -> None:
    for table in ["payments", "driver_earnings", "driver_location_history", "bookings", "customers", "drivers", "users"]:
        op.drop_table(table)
    for enum in ["payout_status", "payment_status", "booking_status", "booking_type", "verification_status", "user_role"]:
        postgresql.ENUM(name=enum).drop(op.get_bind(), checkfirst=True)
