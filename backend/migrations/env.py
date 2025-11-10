from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine
from alembic import context

# 🔹 Saját modulok
from backend.database import Base, engine
from backend.config import DATABASE_URL
from backend.models import user

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


# -----------------------------
# ✅ Offline mód
# -----------------------------
def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# -----------------------------
# ✅ Online mód (ASYNC)
# -----------------------------
def run_migrations_online():
    async def do_run_migrations(connection):
        await connection.run_sync(do_run_migrations_sync)

    def do_run_migrations_sync(connection):
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()

    async def _async_run():
        async with engine.begin() as connection:
            await connection.run_sync(do_run_migrations_sync)

    import asyncio
    asyncio.run(_async_run())


# -----------------------------
# ✅ Fő futtatás
# -----------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
