from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import datetime

from backend.models.rating import Rating
from backend.models.listing import Listing, ListingStatus
from backend.schemas.rating_schema import RatingCreateIn


async def create_rating_logic(
    db: AsyncSession,
    user_id: int,
    data: RatingCreateIn,
):
    """
    Új rating létrehozása egy listinghez.
    """

    # -------------------------
    # Listing létezik + aktív?
    # -------------------------
    stmt = select(Listing).where(
        Listing.id == data.listing_id,
        Listing.status == ListingStatus.active,
    )
    result = await db.execute(stmt)
    listing = result.scalar_one_or_none()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing nem található vagy nem aktív.",
        )

    # -------------------------
    # User már értékelt?
    # -------------------------
    stmt = select(Rating).where(
        Rating.listing_id == data.listing_id,
        Rating.user_id == user_id,
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ezt a hirdetést már értékelted.",
        )

    # -------------------------
    # Rating létrehozása
    # -------------------------
    new_rating = Rating(
        listing_id=data.listing_id,
        user_id=user_id,
        rating=data.rating,
        text=data.text,
        created_at=datetime.utcnow(),
    )

    db.add(new_rating)
    await db.commit()
    await db.refresh(new_rating)

    # detach
    db.expunge(new_rating)

    return new_rating
