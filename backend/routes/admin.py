from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from jose import jwt, JWTError
import os

from utils.common import SECRET_KEY, ALGORITHM, create_access_token, oauth2_scheme

# -----------------------------
# ✅ Router beállítása
# -----------------------------
router = APIRouter(prefix="/admin", tags=["Admin"])


# -----------------------------
# ✅ Admin belépéshez input séma
# -----------------------------
class AdminLoginRequest(BaseModel):
    username: str
    password: str


# -----------------------------
# ✅ /admin/login – bejelentkezés
# -----------------------------
@router.post("/login")
def admin_login(credentials: AdminLoginRequest):
    """Ellenőrzi az .env-ben tárolt admin felhasználót és jelszót"""

    admin_user = os.getenv("ADMIN_USER")
    admin_pass = os.getenv("ADMIN_PASS")

    # 🔒 hitelesítés
    if (
        credentials.username != admin_user
        or credentials.password != admin_pass
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Érvénytelen admin hitelesítési adatok.",
        )

    # ✅ token létrehozása role=admin mezővel
    token = create_access_token({"sub": "admin", "role": "admin"})

    return {"access_token": token, "token_type": "bearer"}


# -----------------------------
# ✅ Admin-token validálás
# -----------------------------
def get_current_admin(token: str = Depends(oauth2_scheme)):
    """Megnézi, hogy a token adminhoz tartozik-e"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        role = payload.get("role")
        if role != "admin":
            raise HTTPException(status_code=403, detail="Nincs jogosultság.")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Érvénytelen vagy lejárt token.")


# -----------------------------
# ✅ Teszt endpoint
# -----------------------------
@router.get("/check")
def admin_check(_: dict = Depends(get_current_admin)):
    """Csak admin tokennel elérhető teszt endpoint"""
    return {"message": "Admin sikeresen hitelesítve ✅"}
