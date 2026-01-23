# backend/schemas/auth_code_schema.py

from pydantic import BaseModel, Field, EmailStr
from backend.models.auth_code import AuthCodePurpose


# ===========================
# ✅ Input schema – auth code igénylése
# ===========================
class AuthCodeRequestIn(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    purpose: AuthCodePurpose


# ===========================
# ✅ Input schema – auth code verifikalasa
# ===========================
class AuthCodeVerifyIn(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    code: str = Field(..., min_length=6, max_length=6)
    purpose: AuthCodePurpose