# backend/routes/admin_logic/update_featured_listing.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.listing import Listing


async def update_featured_listing(
    db: AsyncSession,
    listing_id: int,
    is_featured: bool,
) -> None:
    """
    Admin helper:
    - admin_featured flag állítása
    """

    result = await db.execute(
        select(Listing).where(Listing.id == listing_id)
    )
    listing = result.scalar_one_or_none()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.admin_featured = is_featured

    await db.commit()
