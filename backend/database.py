from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# ---------------------------------------------------
# ✅ Adatbázis URL beállítás környezeti változóból
# ---------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

# ---------------------------------------------------
# ✅ Engine konfiguráció
# ---------------------------------------------------
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

# ---------------------------------------------------
# ✅ Session + Base
# ---------------------------------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
