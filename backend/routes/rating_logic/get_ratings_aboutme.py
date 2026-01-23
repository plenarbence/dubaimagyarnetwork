# backend/routes/rating_logic/get_ratings_aboutme.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.rating import Rating
from backend.models.listing import Listing, ListingStatus
from backend.schemas.rating_schema import MyRatingOut


async def get_ratings_aboutme_logic(
    db: AsyncSession,
    user_id: int,
) -> list[MyRatingOut]:
    """
    Bejelentkezett user HIRDETÉSEIRŐL írt értékelések
    (nem az általa írtak, hanem a hozzá tartozó listingekhez érkezettek)
    """

    stmt = (
        select(
            Rating.id.label("rating_id"),
            Rating.text,
            Rating.rating,
            Rating.created_at,

            Listing.id.label("listing_id"),
            Listing.title.label("listing_title"),
            Listing.status.label("listing_status"),
        )
        .join(Listing, Listing.id == Rating.listing_id)
        .where(Listing.user_id == user_id)   # 👈 EZ A LÉNYEG
        .order_by(Rating.created_at.desc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        MyRatingOut(
            rating_id=r.rating_id,
            text=r.text,
            rating=r.rating,
            created_at=r.created_at,
            listing_id=r.listing_id,
            listing_title=r.listing_title,
            listing_isactive=(r.listing_status == ListingStatus.active),
        )
        for r in rows
    ]
