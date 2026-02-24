from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from backend.database import Base


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)

    # 🔥 Kötelező: mindig tartozzon egy userhez (aki írta)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # 🔥 Kötelező: mindig tartozzon egy listinghez
    listing_id = Column(
        Integer,
        ForeignKey("listings.id", ondelete="CASCADE"),
        nullable=False
    )

    # ⭐ csillagos értékelés (1–5)
    rating = Column(Integer, nullable=False)

    # maximum 1000 karakter (amit API-ban validálunk majd)
    text = Column(String(1000), nullable=True)

    # válasz a tulajtól — opcionális
    owner_response = Column(String(200), nullable=True)

    # mikor készült az értékelés
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    # kapcsolatok
    user = relationship("User", back_populates="ratings")
    listing = relationship("Listing", back_populates="ratings")
