from datetime import datetime
from pydantic import BaseModel, EmailStr


# ===========================
# ✅ Input schema – új user létrehozása
# ===========================
class UserCreate(BaseModel):
    email: EmailStr
    password: str


# ===========================
# ✅ Output schema – válasz a kliensnek
# ===========================
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_verified: bool
    created_at: datetime | None = None
    last_login: datetime | None = None

    class Config:
        from_attributes = True
