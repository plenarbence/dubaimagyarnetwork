from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.public_schema import PublicStatsOut
from backend.routes.public_logic.public_stats_logic import get_public_stats


router = APIRouter(prefix="/public", tags=["Public"])


# 🌍 Public: GET /public/stats
@router.get("/stats", response_model=PublicStatsOut)
async def get_public_stats_route(
    db: AsyncSession = Depends(get_db),
):
    return await get_public_stats(db=db)
