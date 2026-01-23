from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


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


# ===========================
# ✅ Input schema – jelszó megváltoztatása
# ===========================
class ChangePasswordIn(BaseModel):
    old_password: str = Field(..., min_length=8, max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)
    new_password_confirm: str = Field(..., min_length=8, max_length=128)