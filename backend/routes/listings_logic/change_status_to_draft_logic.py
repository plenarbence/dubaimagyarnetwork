from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.listing import Listing
from backend.models.listing import ListingStatus


async def change_status_to_draft(
    db: AsyncSession,
    listing_id: int,
    user_id: int,
) -> None:
    stmt = select(Listing).where(
        Listing.id == listing_id,
        Listing.user_id == user_id,
    )
    result = await db.execute(stmt)
    listing: Listing | None = result.scalar_one_or_none()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.status = ListingStatus.draft
    await db.commit()
