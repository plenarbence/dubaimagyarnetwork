from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from database import get_db
from schemas.user_schema import UserCreate, UserResponse
from auth_logic.jwt_handler import verify_access_token

# 🔹 üzleti logikák (tiszta függvények)
from auth_logic.register import register_user
from auth_logic.login import login_user
from auth_logic.get_current_user import get_current_user
from auth_logic.verify_email import verify_email

# -------------------------------
# ✅ Router beállítása
# -------------------------------
router = APIRouter(prefix="/auth", tags=["Auth"])


# ================================
# ✅ REGISZTRÁCIÓ
# ================================
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(user, db)


# ================================
# ✅ BEJELENTKEZÉS
# ================================
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_user(form_data, db)


# ================================
# ✅ AKTUÁLIS FELHASZNÁLÓ (JWT-ből)
# ================================
@router.get("/me", response_model=UserResponse)
def get_me(email: str = Depends(verify_access_token), db: Session = Depends(get_db)):
    return get_current_user(email, db)


# ================================
# ✅ EMAIL VERIFIKÁCIÓ (átmeneti)
# ================================
@router.post("/verify-email")
def verify_email_route(
    current_email: str = Depends(verify_access_token),
    db: Session = Depends(get_db)
):
    return verify_email(current_email, db)
