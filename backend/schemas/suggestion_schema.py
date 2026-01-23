# backend/schemas/suggestion_schema.py

from pydantic import BaseModel, Field


class SuggestionCreate(BaseModel):
    text: str = Field(..., max_length=1000)
