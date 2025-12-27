from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import aliased
from fastapi import HTTPException, status

from backend.models.listing import Listing
from backend.models.image import Image
from backend.models.rating import Rating
from backend.schemas.listing_schema import ListingPreviewResponse


async def get_listing_preview_logic(
    db: AsyncSession,
    listing_id: int,
    user_id: int,
) -> ListingPreviewResponse:
    """
    Listing preview – owner számára, public kinézethez
    """

    Img = aliased(Image)

    stmt = (
        select(
            # alap
            Listing.title,
            Listing.description,
            Listing.status,

            # üzleti / kontakt
            Listing.company,
            Listing.email,
            Listing.phone_number,
            Listing.website,
            Listing.whatsapp,
            Listing.instagram,
            Listing.tiktok,
            Listing.facebook,
            Listing.youtube,
            Listing.location,
            Listing.tags,
            Listing.admin_comment,

            # rating aggregáció
            func.avg(Rating.rating).label("rating_avg"),
            func.count(Rating.id).label("rating_count"),

            # image URL lista → egyelőre group_concat nélkül, külön szedjük
        )
        .outerjoin(Rating, Rating.listing_id == Listing.id)
        .where(
            Listing.id == listing_id,
            Listing.user_id == user_id,  # 🔒 ownership
        )
        .group_by(
            Listing.title,
            Listing.description,
            Listing.status,
            Listing.company,
            Listing.email,
            Listing.phone_number,
            Listing.website,
            Listing.whatsapp,
            Listing.instagram,
            Listing.tiktok,
            Listing.facebook,
            Listing.youtube,
            Listing.location,
            Listing.tags,
            Listing.admin_comment,
        )
    )

    result = await db.execute(stmt)
    row = result.one_or_none()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing nem található vagy nincs jogosultság.",
        )

    # ---- képek külön, de tisztán ----
    img_stmt = (
        select(Img.url)
        .where(Img.listing_id == listing_id)
        .order_by(Img.is_main.desc(), Img.id.asc())
    )

    img_result = await db.execute(img_stmt)
    image_url_list = [r.url for r in img_result.all()]

    return ListingPreviewResponse(
        title=row.title,
        description=row.description,
        status=row.status,

        company=row.company,
        email=row.email,
        phone_number=row.phone_number,
        website=row.website,
        whatsapp=row.whatsapp,
        instagram=row.instagram,
        tiktok=row.tiktok,
        facebook=row.facebook,
        youtube=row.youtube,
        location=row.location,
        tags=row.tags if isinstance(row.tags, list) else [],

        rating_avg=row.rating_avg,
        rating_count=row.rating_count or 0,

        image_url_list=image_url_list,
        admin_comment=row.admin_comment,
    )
