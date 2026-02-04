from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from sqlalchemy.orm import aliased
from sqlalchemy import text
from sqlalchemy import or_

from backend.models.listing import Listing, ListingStatus
from backend.models.image import Image
from backend.models.rating import Rating
from backend.models.category import Category
from backend.schemas.listing_schema import MyPublicListingCard


async def get_public_listing_cards(
    db: AsyncSession,
    *,
    category_id: int | None = None,
    sort: str = "random",
    seed: float | None = None,
    limit: int = 30,
    offset: int = 0,
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
        .where(Listing.status == ListingStatus.active)
        .group_by(
            Listing.id,
            Listing.title,
            Listing.tags,
            MainImage.url,
            Listing.admin_featured,
        )
    )

    # -----------------------------
    # kategória logika
    # -----------------------------
    if category_id is not None:
        category = await db.get(Category, category_id)
        if category:
            if category.parent_id is None:
                subq = select(Category.id).where(Category.parent_id == category_id)

                stmt = stmt.where(
                    or_(
                        Listing.category_id.in_(subq),
                        Listing.category_id == category_id,
                    )                    
                    )
            else:
                stmt = stmt.where(Listing.category_id == category_id)




    if sort == "random" and seed is not None:
        await db.execute(text("SELECT setseed(:seed)"), {"seed": seed})

    # -----------------------------
    # rendezés (FEATURED MINDIG ELÖL)
    # -----------------------------
    if sort == "most_rated":
        stmt = stmt.order_by(
            desc(Listing.admin_featured),
            desc(func.count(Rating.id)),
        )
    elif sort == "best_rated":
        stmt = stmt.order_by(
            desc(Listing.admin_featured),
            desc(func.avg(Rating.rating)),
            desc(func.count(Rating.id)),
        )
    else:  # random
        stmt = stmt.order_by(
            desc(Listing.admin_featured),
            func.random(),
        )


    stmt = stmt.limit(limit).offset(offset)

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
