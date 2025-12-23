from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import aliased

from backend.models.listing import Listing
from backend.models.image import Image
from backend.models.rating import Rating
from backend.schemas.listing_schema import MyListingResponse


async def get_my_listings_logic(
    db: AsyncSession,
    user_id: int,
) -> list[MyListingResponse]:
    """
    User saját listingjei – listázó / kártya nézethez
    """

    MainImage = aliased(Image)

    stmt = (
        select(
            Listing.id,
            Listing.title,
            Listing.status,
            Listing.tags,

            # rating aggregáció
            func.avg(Rating.rating).label("rating_avg"),
            func.count(Rating.id).label("rating_count"),

            # main image
            MainImage.url.label("main_image_url"),
        )
        .outerjoin(Rating, Rating.listing_id == Listing.id)
        .outerjoin(
            MainImage,
            (MainImage.listing_id == Listing.id)
            & (MainImage.is_main.is_(True)),
        )
        .where(Listing.user_id == user_id)
        .group_by(
            Listing.id,
            Listing.title,
            Listing.status,
            Listing.tags,
            MainImage.url,
        )
        .order_by(Listing.created_at.desc())
    )

    result = await db.execute(stmt)
    rows = result.all()

    listings: list[MyListingResponse] = []

    for row in rows:
        listings.append(
            MyListingResponse(
                id=row.id,
                title=row.title,
                status=row.status,
                tags=row.tags if isinstance(row.tags, list) else [],
                rating_avg=row.rating_avg,
                rating_count=row.rating_count or 0,
                main_image_url=row.main_image_url,
            )
        )

    return listings
