from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.routes.admin_logic.verify_admin import verify_admin_token
from backend.routes.poster_logic.create_poster import create_poster_logic
from backend.routes.poster_logic.delete_poster import delete_poster_logic
from backend.routes.poster_logic.get_public_posters import get_public_posters_logic
from backend.routes.poster_logic.poster_click_logic import poster_click_logic
from backend.schemas.poster_schema import PosterAdminSchema, PosterPublicSchema

router = APIRouter(prefix="/posters", tags=["Posters"])


# 🔒 Admin: POST /posters
@router.post("", response_model=PosterAdminSchema)
async def create_poster(
    file: UploadFile = File(...),
    link: str = Form(...),
    _: dict = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db),
):
    return await create_poster_logic(
        file=file.file,
        link=link,
        db=db,
    )


# 🔒 Admin: DELETE /posters/{poster_id}
@router.delete("/{poster_id}")
async def delete_poster(
    poster_id: int,
    _: dict = Depends(verify_admin_token),
    db: AsyncSession = Depends(get_db),
):
    return await delete_poster_logic(
        poster_id=poster_id,
        db=db,
    )


# 🌍 Public: GET /posters
@router.get("", response_model=list[PosterPublicSchema])
async def get_public_posters(
    db: AsyncSession = Depends(get_db),
):
    return await get_public_posters_logic(db=db)


# 🌍 Public: POST /posters/{poster_id}/click
@router.post("/{poster_id}/click", status_code=204)
async def poster_click(
    poster_id: int,
    db: AsyncSession = Depends(get_db),
):
    await poster_click_logic(
        poster_id=poster_id,
        db=db,
    )





