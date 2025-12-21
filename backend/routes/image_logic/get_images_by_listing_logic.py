from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from backend.models.image import Image
from backend.models.listing import Listing


async def get_images_by_listing_logic(
    db: AsyncSession,
    *,
    listing_id: int,
    user_id: int,
):
    """
    Listing képeinek lekérése:
    - csak a saját listinghez
    - main kép elöl
    - feltöltési sorrend
    """

    # jogosultság: listing a useré
    stmt = select(Listing).where(
        Listing.id == listing_id,
        Listing.user_id == user_id,
    )
    res = await db.execute(stmt)
    listing = res.scalar_one_or_none()

    if not listing:
        raise HTTPException(status_code=403, detail="No permission to view images")

    # képek lekérése
    stmt = (
        select(Image)
        .where(Image.listing_id == listing_id)
        .order_by(
            Image.is_main.desc(),      # main kép elöl
            Image.uploaded_at.asc(),   # majd időrend
        )
    )

    res = await db.execute(stmt)
    images = res.scalars().all()

    return images
