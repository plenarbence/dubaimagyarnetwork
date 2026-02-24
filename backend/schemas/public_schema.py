from pydantic import BaseModel


class PublicStatsOut(BaseModel):
    users: int
    listings: int
    ratings: int
    listing_clicks: int
    contact_clicks: int
