from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.schemas.admin_schema import AdminLoginRequest
from backend.schemas.user_schema import UserResponse
from backend.database import get_db

from backend.routes.admin_logic.admin_login import admin_login_logic
from backend.routes.admin_logic.verify_admin import verify_admin_token
from backend.routes.admin_logic.list_users import list_users_logic
from backend.routes.admin_logic.admin_rate_limiter import check_rate_limit


# ================================
# ✅ Router beállítása
# ================================
router = APIRouter(prefix="/admin", tags=["Admin"])


# ================================
# ✅ Admin bejelentkezés
# ================================
@router.post("/login")
def admin_login(request: Request, credentials: AdminLoginRequest):
    """
    Bejelentkezteti az admint, ha az adatok helyesek,
    és JWT tokent ad vissza.
    """
    check_rate_limit(request)
    return admin_login_logic(credentials.username, credentials.password)



# ================================
# ✅ Admin token verify
# ================================
@router.get("/verify", status_code=status.HTTP_200_OK)
def verify_admin_route(_: dict = Depends(verify_admin_token)):
    """
    Ellenőrzi, hogy az admin token érvényes-e.
    Ha igen → 200 OK
    Ha nem → 401 / 403 (verify_admin_token dobja)
    """
    return {"status": "ok"}


# ================================
# ✅ Felhasználók listázása (Admin)
# ================================
@router.get("/users", response_model=list[UserResponse])
async def list_users_route(
    _: dict = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db),
):
    """
    Csak admin tokennel elérhető.
    Visszaadja az összes regisztrált felhasználót.
    """
    return await list_users_logic(db)
