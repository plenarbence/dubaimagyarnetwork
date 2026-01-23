# backend/models/auth_code.py

from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum,
)
from sqlalchemy.sql import func
from backend.database import Base
import enum


# ===========================
# ✅ Auth code purpose enum
# ===========================
class AuthCodePurpose(str, enum.Enum):
    email_verify = "email_verify"
    password_reset = "password_reset"


# ===========================
# ✅ Auth code model
# ===========================
class AuthCode(Base):
    __tablename__ = "auth_codes"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), nullable=False, index=True)

    code_hash = Column(String(255), nullable=False)

    purpose = Column(
        Enum(AuthCodePurpose),
        nullable=False,
        index=True,
    )

    attempts = Column(Integer, default=0, nullable=False)

    expires_at = Column(DateTime, nullable=False, index=True)

    used_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
