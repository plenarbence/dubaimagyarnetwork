from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.listing_schema import ListingCreate, ListingCreateResponse, ListingResponse, MyListingResponse, ListingPreviewResponse, MyPublicListingCard, PublicListingDetailOut
from backend.routes.listings_logic.create_listing import create_listing_logic
from backend.routes.auth import get_me 
from backend.routes.listings_logic.get_listing_by_id_logic import get_listing_by_id_logic
from backend.routes.listings_logic.update_listing_logic import update_listing_logic
from backend.routes.listings_logic.submit_listing_logic import submit_listing_logic
from backend.routes.listings_logic.get_my_listings import get_my_listings_logic
from backend.routes.listings_logic.get_listing_preview_logic import get_listing_preview_logic
from backend.routes.listings_logic.get_public_listing_card import get_public_listing_cards
from backend.routes.listings_logic.get_public_featured_cards import get_public_featured_cards
from backend.routes.listings_logic.get_listing_public import get_listing_public_logic
from backend.routes.listings_logic.change_status_to_draft_logic import change_status_to_draft
from backend.routes.listings_logic.change_status_to_expired_logic import change_status_to_expired
from backend.routes.listings_logic.change_status_to_pending_admin_logic import change_status_to_pending_admin
from backend.routes.listings_logic.click_counter_logic import listing_click_counter_logic

router = APIRouter(prefix="/listings", tags=["Listings"])



# ============================================================
# ✅ USER – saját listingjeinek listázása (My Listings) (ennek kell legfelul lenni..)
# ============================================================
@router.get("/my", response_model=list[MyListingResponse])
async def get_my_listings(db: AsyncSession = Depends(get_db), current_user=Depends(get_me)):
    return await get_my_listings_logic(db=db, user_id=current_user.id)



# user: create listing
@router.post("/create", response_model=ListingCreateResponse) 
async def create_listing(data: ListingCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_me)):
    return await create_listing_logic(db=db, user_id=current_user.id, data=data)


# ============================================================
# ✅ PUBLIC – listingek listázása (card view)
# ============================================================
@router.get("/public/cards", response_model=list[MyPublicListingCard])
async def get_public_listing_cards_endpoint(
    category_id: int | None = None,
    sort: str = "random",
    seed: float | None = None,
    limit: int = 30,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    return await get_public_listing_cards(
        db=db,
        category_id=category_id,
        sort=sort,
        seed=seed,
        limit=limit,
        offset=offset,
    )


# ============================================================
# ✅ PUBLIC – single listing detail
# ============================================================
@router.get("/public/listing/{listing_id}", response_model=PublicListingDetailOut)
async def get_public_listing_detail(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
):
    return await get_listing_public_logic(
        db=db,
        listing_id=listing_id,
    )





# user: get single listing by id (edit / detail)
@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(listing_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_me)):
    return await get_listing_by_id_logic(db=db, listing_id=listing_id, user_id=current_user.id)



@router.put("/{listing_id}", response_model=ListingCreateResponse)
async def update_listing(listing_id: int, data: ListingCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_me)):
    return await update_listing_logic(db=db, listing_id=listing_id, user_id=current_user.id, data=data)



@router.put("/{listing_id}/submit", response_model=ListingCreateResponse)
async def submit_listing(listing_id: int, data: ListingCreate, db: AsyncSession = Depends(get_db), current_user = Depends(get_me)):
    return await submit_listing_logic(db=db, listing_id=listing_id, user_id=current_user.id, data=data)



# user: get single listing preview
@router.get("/{listing_id}/preview", response_model=ListingPreviewResponse)
async def get_listing_preview(listing_id: int, db: AsyncSession = Depends(get_db), current_user=Depends(get_me)):
    return await get_listing_preview_logic(db=db, listing_id=listing_id, user_id=current_user.id)



# ============================================================
# ✅ PUBLIC – featured listingek (home page)
# ============================================================
@router.get("/public/featured-cards", response_model=list[MyPublicListingCard])
async def get_public_featured_cards_endpoint(
    db: AsyncSession = Depends(get_db),
):
    return await get_public_featured_cards(db=db)


# ============================================================
# ✅ USER – listing visszaállítása draft állapotba
# ============================================================
@router.post("/{listing_id}/to-draft", status_code=204)
async def change_listing_to_draft(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    # ownership checket most nem kérsz → nincs
    await change_status_to_draft(
        db=db,
        listing_id=listing_id,
        user_id=current_user.id
    )
    return None


# ============================================================
# ✅ USER – listing lejárttá tétele
# ============================================================
@router.post("/{listing_id}/to-expired", status_code=204)
async def change_listing_to_expired(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    await change_status_to_expired(
        db=db,
        listing_id=listing_id,
        user_id=current_user.id
    )
    return None


# ============================================================
# ✅ USER – listing submit
# ============================================================
@router.post("/{listing_id}/to-pending-admin", status_code=204)
async def change_listing_to_pending_admin(
    listing_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    await change_status_to_pending_admin(
        db=db,
        listing_id=listing_id,
        user_id=current_user.id
    )
    return None


# ============================================================
# ✅ PUBLIC – listing click counter
# ============================================================
@router.post("/{listing_id}/click", status_code=204)
async def listing_click(
    listing_id: int,
    target: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    try:
        await listing_click_counter_logic(
            listing_id=listing_id,
            target=target,
            db=db,
        )
    except Exception:
        # best-effort: mindent lenyelünk
        pass

    return None
