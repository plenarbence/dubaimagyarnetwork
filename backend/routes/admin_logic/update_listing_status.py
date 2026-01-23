from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.listing import Listing
from backend.models.listing import ListingStatus 


async def update_listing_status(
    db: AsyncSession,
    listing_id: int,
    new_status: str,
) -> None:
    try:
        status_enum = ListingStatus(new_status)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid listing status",
        )

    stmt = select(Listing).where(Listing.id == listing_id)
    result = await db.execute(stmt)
    listing: Listing | None = result.scalar_one_or_none()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.status = status_enum
    await db.commit()
