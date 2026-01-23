from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import aliased

from backend.models.listing import Listing, ListingStatus
from backend.models.image import Image
from backend.models.rating import Rating
from backend.schemas.listing_schema import MyPublicListingCard


async def get_public_featured_cards(
    db: AsyncSession,
) -> list[MyPublicListingCard]:

    MainImage = aliased(Image)

    stmt = (
        select(
            Listing.id,
            Listing.title,
            Listing.tags,
            func.avg(Rating.rating).label("rating_avg"),
            func.count(Rating.id).label("rating_count"),
            MainImage.url.label("main_image_url"),
            Listing.admin_featured.label("is_featured"),
        )
        .outerjoin(Rating, Rating.listing_id == Listing.id)
        .outerjoin(
            MainImage,
            (MainImage.listing_id == Listing.id)
            & (MainImage.is_main.is_(True)),
        )
        .where(
            Listing.status == ListingStatus.active,
            Listing.admin_featured.is_(True),
        )
        .group_by(
            Listing.id,
            Listing.title,
            Listing.tags,
            MainImage.url,
            Listing.admin_featured,
        )
        .order_by(func.random())
    )

    result = await db.execute(stmt)
    rows = result.all()

    return [
        MyPublicListingCard(
            id=row.id,
            title=row.title,
            tags=row.tags if isinstance(row.tags, list) else [],
            rating_avg=row.rating_avg,
            rating_count=row.rating_count or 0,
            main_image_url=row.main_image_url,
            is_featured=row.is_featured,
        )
        for row in rows
    ]
