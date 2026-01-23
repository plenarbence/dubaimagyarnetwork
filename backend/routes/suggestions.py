from fastapi import APIRouter, Depends, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.schemas.suggestion_schema import SuggestionCreate
from backend.routes.suggestions_logic.create_suggestion_logic import  create_suggestion_logic
from backend.routes.suggestions_logic.rate_limit import rate_limit_5_per_minute

router = APIRouter(prefix="/suggestions", tags=["Suggestions"])



# create suggestion
@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
async def create_suggestion(
    payload: SuggestionCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    rate_limit_5_per_minute(request)
    await create_suggestion_logic(db, payload)
    return {"ok": True}
