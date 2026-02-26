from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.public_schema import PublicStatsOut
from backend.routes.public_logic.public_stats_logic import get_public_stats

from sqlalchemy import select
from backend.models.listing import Listing, ListingStatus

from backend.models.category import Category


router = APIRouter(prefix="/public", tags=["Public"])


# 🌍 Public: GET /public/stats
@router.get("/stats", response_model=PublicStatsOut)
async def get_public_stats_route(
    db: AsyncSession = Depends(get_db),
):
    return await get_public_stats(db=db)


# Public: all listings ids for sitemap
@router.get("/sitemap/listing-ids")
async def get_active_listing_ids(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Listing.id).where(Listing.status == ListingStatus.active)
    )

    return result.scalars().all()



# Public: parent category slugs for sitemap
@router.get("/sitemap/category-slugs")
async def get_parent_category_slugs(
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Category.slug).where(Category.parent_id.is_(None))
    )
    return result.scalars().all()