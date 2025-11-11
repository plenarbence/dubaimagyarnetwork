# backend/routes/content.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.schemas.content_schema import ContentUpdate
from backend.routes.admin_logic.verify_admin import verify_admin_token
from backend.routes.content_logic.get_content import get_content_logic
from backend.routes.content_logic.update_content import update_content_logic

router = APIRouter(prefix="/content", tags=["Content"])


# 🔹 Nyilvános: GET /content/{key}
@router.get("/{key}")
async def get_content(key: str, db: AsyncSession = Depends(get_db)):
    return await get_content_logic(key, db)


# 🔹 Csak admin: PUT /content/{key}
@router.put("/{key}")
async def update_content(
    key: str,
    data: ContentUpdate,
    _: dict = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db),
):
    return await update_content_logic(key, data, db)
