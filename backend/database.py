# backend/database.py
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from backend.config import DATABASE_URL

# -----------------------------
# ✅ Engine
# -----------------------------
engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # <-- EZ OLDJA MEG A HIBÁT
    pool_size=5,
    max_overflow=10,
    pool_recycle=1800,    # 30 perc
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)


# -----------------------------
# ✅ Session & Base
# -----------------------------
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



# -----------------------------------
# engine → adatbázis kapcsolat
# SessionLocal → tranzakciókezelés
# Base → modellek alapja
# -----------------------------------


# ================================
# ✅ DB session kezelése
# ================================
async def get_db():
    async with SessionLocal() as db:
        yield db
