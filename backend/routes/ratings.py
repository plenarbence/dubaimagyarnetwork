from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.routes.auth import get_me
from backend.schemas.rating_schema import RatingCreateIn, PublicRatingOut, MyRatingOut
from backend.routes.rating_logic.create_rating_logic import create_rating_logic
from backend.routes.rating_logic.delete_rating_logic import delete_rating_logic
from backend.routes.rating_logic.get_my_ratings_logic import get_my_ratings_logic
from backend.routes.rating_logic.get_ratings_aboutme import get_ratings_aboutme_logic


router = APIRouter(prefix="/ratings", tags=["Ratings"])


# ============================================================
# ✅ USER – create rating
# ============================================================
@router.post("/create", response_model=PublicRatingOut)
async def create_rating(
    data: RatingCreateIn,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    return await create_rating_logic(
        db=db,
        user_id=current_user.id,
        data=data,
    )



# ============================================================
# ✅ USER – delete own rating
# ============================================================
@router.delete("/{rating_id}")
async def delete_rating(
    rating_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    return await delete_rating_logic(
        db=db,
        user_id=current_user.id,
        rating_id=rating_id,
    )





# ============================================================
# ✅ USER – get my ratings
# ============================================================
@router.get("/my", response_model=list[MyRatingOut])
async def get_my_ratings(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    return await get_my_ratings_logic(
        db=db,
        user_id=current_user.id,
    )


# ============================================================
# ✅ USER – get ratings about me (a hirdetéseimről írt értékelések)
# ============================================================
@router.get("/about-me", response_model=list[MyRatingOut])
async def get_ratings_about_me(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_me),
):
    return await get_ratings_aboutme_logic(
        db=db,
        user_id=current_user.id,
    )
