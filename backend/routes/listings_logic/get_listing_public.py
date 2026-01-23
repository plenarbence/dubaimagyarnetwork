from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import aliased
from fastapi import HTTPException, status

from backend.models.listing import Listing
from backend.models.image import Image
from backend.models.rating import Rating
from backend.schemas.listing_schema import PublicListingDetailOut
from backend.schemas.rating_schema import PublicRatingOut
from backend.models.listing import ListingStatus

from backend.routes.profanity_logic.profanity_list import get_profanity_list
from backend.routes.profanity_logic.profanity_check import censor_profanities



async def get_listing_public_logic(
    db: AsyncSession,
    listing_id: int,
) -> PublicListingDetailOut:
    """
    Public listing detail – látogatóknak
    """

    Img = aliased(Image)

    # =========================
    # Alap + aggregált adatok
    # =========================
    stmt = (
        select(
            # ---- alap ----
            Listing.title,
            Listing.description,

            # ---- üzleti / kontakt ----
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

            # ---- rating aggregáció ----
            func.avg(Rating.rating).label("rating_avg"),
            func.count(Rating.id).label("rating_count"),
        )
        .outerjoin(Rating, Rating.listing_id == Listing.id)
        .where(
            Listing.id == listing_id,
            Listing.status == ListingStatus.active
        )
        .group_by(
            Listing.title,
            Listing.description,
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
        )
    )

    result = await db.execute(stmt)
    row = result.one_or_none()

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing nem található.",
        )

    # =========================
    # Képek
    # =========================
    img_stmt = (
        select(Img.url)
        .where(Img.listing_id == listing_id)
        .order_by(Img.is_main.desc(), Img.id.asc())
    )

    img_result = await db.execute(img_stmt)
    image_url_list = [r.url for r in img_result.all()]

    # =========================
    # Karomkodas lista
    # =========================
    profanity_list = await get_profanity_list(db)

    # =========================
    # Rating lista
    # =========================
    rating_stmt = (
        select(
            Rating.id,
            Rating.user_id,
            Rating.created_at,
            Rating.rating,
            Rating.text,
        )
        .where(Rating.listing_id == listing_id)
        .order_by(Rating.created_at.desc())
    )

    rating_result = await db.execute(rating_stmt)
    ratings_list = [
        PublicRatingOut(
            id=r.id,
            user_id=r.user_id,
            created_at=r.created_at,
            rating=r.rating,
            text=censor_profanities(r.text, profanity_list),
        )
        for r in rating_result.all()
    ]

    # =========================
    # Response
    # =========================
    return PublicListingDetailOut(
        title=row.title,
        description=row.description,

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
        ratings_list=ratings_list,
    )
