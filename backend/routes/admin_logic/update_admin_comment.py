from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from backend.models.listing import Listing


async def update_admin_comment(
    db: AsyncSession,
    listing_id: int,
    admin_comment: str | None,
) -> None:
    stmt = select(Listing).where(Listing.id == listing_id)
    result = await db.execute(stmt)
    listing: Listing | None = result.scalar_one_or_none()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    listing.admin_comment = admin_comment
    await db.commit()
