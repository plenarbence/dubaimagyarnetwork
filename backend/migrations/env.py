from logging.config import fileConfig
from alembic import context
import os
from sqlalchemy import engine_from_config, pool

# 🔹 Saját modulok
from backend.database import Base
from backend.config import DATABASE_URL
from backend.models import user, category, content, listing, image, rating    # ez kell hogy lassa a modelleket


def get_sync_database_url():
    url = DATABASE_URL
    return url.replace("postgresql+asyncpg://", "postgresql+psycopg://")



config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


# -----------------------------
# ✅ Offline mód
# -----------------------------
def run_migrations_offline():
    context.configure(
        url=get_sync_database_url(),
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
    config.set_main_option("sqlalchemy.url", get_sync_database_url())

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()



# -----------------------------
# ✅ Fő futtatás
# -----------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
