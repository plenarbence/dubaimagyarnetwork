from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.listing_schema import ListingCreate, ListingCreateResponse, ListingResponse, MyListingResponse
from backend.routes.listings_logic.create_listing import create_listing_logic
from backend.routes.auth import get_me 
from backend.routes.listings_logic.get_listing_by_id_logic import get_listing_by_id_logic
from backend.routes.listings_logic.update_listing_logic import update_listing_logic
from backend.routes.listings_logic.submit_listing_logic import submit_listing_logic
from backend.routes.listings_logic.get_my_listings import get_my_listings_logic




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



