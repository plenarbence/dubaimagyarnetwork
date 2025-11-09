from fastapi import HTTPException, status
from backend.config import ADMIN_USER, ADMIN_PASS
from backend.routes.auth_logic.jwt_handler import create_access_token


# ================================
# ✅ Admin bejelentkezés logika
# ================================
def admin_login_logic(username: str, password: str):
    """Ellenőrzi az admin adatait és JWT tokent ad vissza"""

    if username != ADMIN_USER or password != ADMIN_PASS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Érvénytelen admin hitelesítési adatok.",
        )

    token = create_access_token({"sub": "admin"})
    return {"access_token": token, "token_type": "bearer"}
