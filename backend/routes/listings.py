from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session

from database import SessionLocal
from models.listing import Listing, ListingStatus
from schemas.listing_schema import (
    ListingCreate,
    ListingResponse,
    ListingAdminUpdate,
)
from routes.auth import get_current_user        # user-token validálás
from routes.admin import get_current_admin      # admin-token validálás


# -----------------------------
# ✅ Router beállítása
# -----------------------------
router = APIRouter(prefix="/listings", tags=["Listings"])


# -----------------------------
# ✅ DB session kezelése
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# ✅ USER – új listing létrehozása
# ============================================================
@router.post("/create", response_model=ListingResponse)
def create_listing(
    data: ListingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Verified user új hirdetést hozhat létre. Alapértelmezés: draft státusz."""

    if not current_user.is_verified:
        raise HTTPException(status_code=403, detail="A felhasználó nincs verifikálva.")

    listing = Listing(
        title=data.title,
        description=data.description,
        user_id=current_user.id,
        status=ListingStatus.draft,
        created_at=datetime.utcnow(),
        # opcionális kontaktadatok
        email=data.email,
        phone_number=data.phone_number,
        website=data.website,
        whatsapp=data.whatsapp,
        instagram=data.instagram,
        tiktok=data.tiktok,
        facebook=data.facebook,
        youtube=data.youtube,
        location=data.location,
        # új mezők
        company=data.company,
        tags=data.tags if isinstance(data.tags, list) else [],
    )

    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


# ============================================================
# ✅ ADMIN – összes listing listázása
# ============================================================
@router.get("/all", response_model=List[ListingResponse])
def get_all_listings(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    """Admin lekérheti az összes hirdetést (bármilyen státuszban)."""
    listings = db.query(Listing).order_by(Listing.created_at.desc()).all()

    # védelem: tags mindig lista legyen
    for listing in listings:
        if not isinstance(listing.tags, list):
            listing.tags = []

    return listings


# ============================================================
# ✅ ADMIN – adott listing frissítése (kategorizálás, jóváhagyás, visszadobás)
# ============================================================
@router.patch("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    update_data: ListingAdminUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing nem található.")

    # mezők frissítése
    if update_data.category_id is not None:
        listing.category_id = update_data.category_id

    if update_data.status is not None:
        listing.status = update_data.status

        if update_data.status == ListingStatus.awaiting_payment:
            listing.approved_at = datetime.utcnow()

        elif update_data.status == ListingStatus.active:
            listing.published_at = datetime.utcnow()
            listing.visibility_until = datetime.utcnow().replace(microsecond=0)

    if update_data.admin_comment is not None:
        listing.admin_comment = update_data.admin_comment

    db.commit()
    db.refresh(listing)

    # biztos ami biztos: tags mindig lista
    if not isinstance(listing.tags, list):
        listing.tags = []

    return listing


# ============================================================
# ✅ USER – saját listingjeinek lekérése
# ============================================================
@router.get("/my", response_model=List[ListingResponse])
def get_my_listings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Bejelentkezett user saját hirdetéseit látja (beleértve a draftokat is)."""
    listings = (
        db.query(Listing)
        .filter(Listing.user_id == current_user.id)
        .order_by(Listing.created_at.desc())
        .all()
    )

    # védelem: tags mindig lista legyen
    for listing in listings:
        if not isinstance(listing.tags, list):
            listing.tags = []

    return listings


# ============================================================
# ✅ USER – státusz módosítás (biztonságosan, saját hirdetésre)
# ============================================================
@router.patch("/my/{listing_id}/status", response_model=ListingResponse)
def user_update_listing_status(
    listing_id: int,
    new_status: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Felhasználó saját hirdetésének státuszát módosíthatja.
    Csak engedett státuszváltásokat támogat.
    """
    listing = (
        db.query(Listing)
        .filter(Listing.id == listing_id, Listing.user_id == current_user.id)
        .first()
    )

    if not listing:
        raise HTTPException(status_code=404, detail="Hirdetés nem található vagy nincs jogosultság.")

    allowed_transitions = {
        ListingStatus.draft: [ListingStatus.pending_admin],
        ListingStatus.rejected: [ListingStatus.pending_admin],
        ListingStatus.awaiting_payment: [ListingStatus.active],
        ListingStatus.active: [ListingStatus.pending_admin],
        ListingStatus.expired: [ListingStatus.pending_admin],
    }

    current = listing.status
    try:
        target = ListingStatus(new_status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Érvénytelen státuszérték.")

    if target not in allowed_transitions.get(current, []):
        raise HTTPException(
            status_code=403,
            detail=f"Ez a státuszváltás nem engedélyezett: {current} → {target}",
        )

    listing.status = target

    # extra események (pl. publikálás dátuma)
    if target == ListingStatus.active:
        listing.published_at = datetime.utcnow()
        listing.visibility_until = datetime.utcnow().replace(microsecond=0)

    db.commit()
    db.refresh(listing)

    # biztos ami biztos: tags mindig lista
    if not isinstance(listing.tags, list):
        listing.tags = []

    return listing





# ============================================================
# ✅ USER – saját listing frissítése (pl. cím, leírás, kontaktadatok)
# ============================================================
@router.patch("/my/{listing_id}", response_model=ListingResponse)
def update_my_listing(
    listing_id: int,
    data: ListingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    A bejelentkezett felhasználó frissítheti a SAJÁT hirdetését.
    Csak a saját hirdetéseire van jogosultsága.
    """

    # ---- Saját hirdetés lekérdezése ----
    listing = (
        db.query(Listing)
        .filter(Listing.id == listing_id, Listing.user_id == current_user.id)
        .first()
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Hirdetés nem található vagy nincs jogosultság.",
        )

    # ---- Mezők frissítése ----
    listing.title = data.title
    listing.description = data.description
    listing.company = data.company
    listing.phone_number = data.phone_number
    listing.email = data.email
    listing.website = data.website
    listing.location = data.location
    listing.whatsapp = data.whatsapp
    listing.instagram = data.instagram
    listing.tiktok = data.tiktok
    listing.facebook = data.facebook
    listing.youtube = data.youtube
    listing.tags = data.tags if isinstance(data.tags, list) else []
    listing.category_id = data.category_id
    listing.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(listing)

    # biztonság kedvéért
    if not isinstance(listing.tags, list):
        listing.tags = []

    return listing



# ============================================================
# ✅ PUBLIKUS – adott hirdetés lekérése ID alapján
# ============================================================
@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing_by_id(
    listing_id: int,
    db: Session = Depends(get_db),
):
    """Publikus vagy preview lekérés egy adott hirdetéshez."""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Hirdetés nem található.")

    # biztonság kedvéért
    if not isinstance(listing.tags, list):
        listing.tags = []

    return listing
