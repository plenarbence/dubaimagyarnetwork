from fastapi import APIRouter, Depends, Request, status, Body
from sqlalchemy.ext.asyncio import AsyncSession

from backend.schemas.admin_schema import AdminLoginRequest, AdminFeaturedListingSchema
from backend.database import get_db

from backend.schemas.category_schema import CategorySEOSchema
from backend.routes.admin_logic.admin_login import admin_login_logic
from backend.routes.admin_logic.verify_admin import verify_admin_token
from backend.routes.admin_logic.admin_rate_limiter import check_rate_limit
from backend.routes.admin_logic.listing_counts import get_listing_state_counts
from backend.routes.admin_logic.list_listings_by_state import list_admin_listings_by_state
from backend.routes.admin_logic.get_listing_detail import get_admin_listing_detail
from backend.routes.admin_logic.update_admin_comment import update_admin_comment
from backend.routes.admin_logic.update_listing_status import update_listing_status
from backend.routes.admin_logic.update_listing_category import update_listing_category
from backend.routes.admin_logic.get_main_categories_seo import get_main_categories_seo
from backend.routes.admin_logic.save_category_seo import save_category_seo
from backend.routes.admin_logic.get_featured_listings import get_featured_listings
from backend.routes.admin_logic.update_featured_listing import update_featured_listing

from backend.models.listing import ListingStatus


# ================================
# ✅ Router beállítása
# ================================
router = APIRouter(prefix="/admin", tags=["Admin"])


# ================================
# ✅ Admin bejelentkezés
# ================================
@router.post("/login")
def admin_login(request: Request, credentials: AdminLoginRequest):
    """
    Bejelentkezteti az admint, ha az adatok helyesek,
    és JWT tokent ad vissza.
    """
    check_rate_limit(request)
    return admin_login_logic(credentials.username, credentials.password)



# ================================
# ✅ Admin token verify
# ================================
@router.get("/verify", status_code=status.HTTP_200_OK)
def verify_admin_route(_: dict = Depends(verify_admin_token)):
    """
    Ellenőrzi, hogy az admin token érvényes-e.
    Ha igen → 200 OK
    Ha nem → 401 / 403 (verify_admin_token dobja)
    """
    return {"status": "ok"}


# ================================
# ✅ Admin – Listing státusz darabszámok
# ================================
@router.get("/listings/counts", status_code=status.HTTP_200_OK)
async def get_admin_listing_counts(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    """
    Visszaadja az admin oldalon használt listing státuszok darabszámát.
    """
    return await get_listing_state_counts(db)


# ================================
# ✅ Admin – Listingek listázása státusz szerint
# ================================
@router.get("/listings", status_code=status.HTTP_200_OK)
async def get_admin_listings_by_state(
    state: ListingStatus,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    """
    Admin listing lista adott státuszra szűrve,
    created_at DESC szerint rendezve.
    """
    return await list_admin_listings_by_state(db, state)


# ================================
# ✅ Admin – Listing details
# ================================
@router.get("/listings/{listing_id}", status_code=status.HTTP_200_OK)
async def get_admin_listing_detail_route(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    return await get_admin_listing_detail(db, listing_id)


# ================================
# ✅ Admin – admin comment
# ================================
@router.patch(
    "/listings/{listing_id}/admin-comment", status_code=status.HTTP_204_NO_CONTENT,)
async def update_admin_comment_route(
    listing_id: int,
    admin_comment: str | None = Body(default=None),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    await update_admin_comment(
        db=db,
        listing_id=listing_id,
        admin_comment=admin_comment,
    )


# ================================
# ✅ Admin – listing status
# ================================
@router.patch("/listings/{listing_id}/status", status_code=status.HTTP_204_NO_CONTENT,)
async def update_listing_status_route(
    listing_id: int,
    status_value: str = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    await update_listing_status(
        db=db,
        listing_id=listing_id,
        new_status=status_value,
    )


# ================================
# ✅ Admin – listing category
# ================================
@router.patch("/listings/{listing_id}/category", status_code=status.HTTP_204_NO_CONTENT,)
async def update_listing_category_route(
    listing_id: int,
    child_category_id: int = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    await update_listing_category(
        db=db,
        listing_id=listing_id,
        child_category_id=child_category_id,
    )


# ================================
# ✅ Admin – main categories for SEO
# ================================
@router.get(
    "/categories/main/seo",
    response_model=list[CategorySEOSchema],
    status_code=status.HTTP_200_OK,
)
async def get_admin_main_categories_seo(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    return await get_main_categories_seo(db)


# ================================
# ✅ Admin – Category SEO update
# ================================
@router.patch(
    "/categories/{category_id}/seo",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def update_category_seo_route(
    category_id: int,
    payload: dict = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    await save_category_seo(
        db=db,
        category_id=category_id,
        slug=payload.get("slug"),
        seo_title=payload.get("seo_title"),
        seo_description=payload.get("seo_description"),
        seo_h1=payload.get("seo_h1"),
        seo_intro=payload.get("seo_intro"),
    )



# ================================
# ✅ Admin – Featured listings
# ================================
@router.get(
    "/listings-featured",
    response_model=list[AdminFeaturedListingSchema],
    status_code=status.HTTP_200_OK,
)
async def get_admin_featured_listings(
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    return await get_featured_listings(db)




# ================================
# ✅ Admin – update featured listing
# ================================
@router.patch(
    "/listings/{listing_id}/featured",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def update_admin_featured_listing(
    listing_id: int,
    is_featured: bool = Body(...),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(verify_admin_token),
):
    await update_featured_listing(
        db=db,
        listing_id=listing_id,
        is_featured=is_featured,
    )
