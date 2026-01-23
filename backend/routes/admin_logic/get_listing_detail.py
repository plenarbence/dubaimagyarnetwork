from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from fastapi import HTTPException, status


from backend.models.listing import Listing
from backend.models.category import Category
from backend.schemas.admin_schema import AdminListingDetail




async def get_admin_listing_detail(
    db: AsyncSession,
    listing_id: int,
) -> AdminListingDetail:
    stmt = (
        select(Listing)
        .where(Listing.id == listing_id)
        .options(
            joinedload(Listing.user),
            joinedload(Listing.category),
            joinedload(Listing.images),
            joinedload(Listing.category).joinedload(Category.parent),
        )
    )

    result = await db.execute(stmt)
    listing: Listing | None = result.unique().scalar_one_or_none()

    if listing is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found",
        )

    return AdminListingDetail(
        # ---------------------------------------
        # 🧾 Alapadatok
        # ---------------------------------------
        id=listing.id,
        title=listing.title,
        description=listing.description,
        status=listing.status,
        created_at=listing.created_at,
        approved_at=listing.approved_at,
        published_at=listing.published_at,
        visibility_until=listing.visibility_until,

        # ---------------------------------------
        # 👤 User / kategória
        # ---------------------------------------
        user_id=listing.user_id,
        user_email=listing.user.email,

        main_category=(
            listing.category.parent.name
            if listing.category and listing.category.parent
            else listing.category.name
            if listing.category
            else None
        ),

        sub_category=(
            listing.category.name
            if listing.category and listing.category.parent
            else None
        ),

        # ---------------------------------------
        # 🖼️ Képek
        # ---------------------------------------
        image_url_list=[img.url for img in listing.images],

        # ---------------------------------------
        # 🏢 Üzleti és elérhetőségi adatok
        # ---------------------------------------
        company=listing.company,
        email=listing.email,
        phone_number=listing.phone_number,
        website=listing.website,
        whatsapp=listing.whatsapp,
        instagram=listing.instagram,
        tiktok=listing.tiktok,
        facebook=listing.facebook,
        youtube=listing.youtube,
        location=listing.location,
        tags=listing.tags,

        # ---------------------------------------
        # 🧠 Admin
        # ---------------------------------------
        admin_comment=listing.admin_comment,

        # ---------------------------------------
        # 📊 Click counterek
        # ---------------------------------------
        click_counter=listing.click_counter,
        click_counter_featured=listing.click_counter_featured,
        click_website=listing.click_website,
        click_email=listing.click_email,
        click_phone=listing.click_phone,
        click_whatsapp=listing.click_whatsapp,
        click_instagram=listing.click_instagram,
        click_tiktok=listing.click_tiktok,
        click_facebook=listing.click_facebook,
        click_youtube=listing.click_youtube,
    )
