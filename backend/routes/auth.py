from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.user_schema import UserCreate, UserResponse, ChangePasswordIn
from backend.routes.auth_logic.jwt_handler import verify_access_token

# 🔹 üzleti logikák (tiszta függvények)
from backend.routes.auth_logic.register import register_user
from backend.routes.auth_logic.login import login_user
from backend.routes.auth_logic.get_current_user import get_current_user
from backend.routes.auth_logic.change_password import change_password
from fastapi import status

# -------------------------------
# ✅ Router beállítása
# -------------------------------
router = APIRouter(prefix="/auth", tags=["Auth"])


# ================================
# ✅ REGISZTRÁCIÓ
# ================================
@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(user, db)


# ================================
# ✅ BEJELENTKEZÉS
# ================================
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    return await login_user(form_data, db)


# ================================
# ✅ AKTUÁLIS FELHASZNÁLÓ (JWT-ből)
# ================================
@router.get("/me", response_model=UserResponse)
async def get_me(email: str = Depends(verify_access_token), db: AsyncSession = Depends(get_db)):
    return await get_current_user(email, db)


# ================================
# ✅ Token validacio (nem keri le a felhasznalot csak csekkolja hogy a token valid e)
# ================================
@router.get("/verify")
def verify_token(email: str = Depends(verify_access_token)):
    return {"valid": True}


# ================================
# ✅ JELSZÓ MEGVÁLTOZTATÁSA (bejelentkezve)
# ================================
@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password_endpoint(
    data: ChangePasswordIn,
    email: str = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    await change_password(
        db=db,
        email=email,
        old_password=data.old_password,
        new_password=data.new_password,
        new_password_confirm=data.new_password_confirm,
    )
    return None

