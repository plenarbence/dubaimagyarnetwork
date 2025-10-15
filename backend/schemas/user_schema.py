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

    class Config:
        orm_mode = True
