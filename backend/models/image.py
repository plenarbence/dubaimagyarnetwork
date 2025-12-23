from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)

    # 🔥 MUST HAVE: mindig legyen hirdetéshez kötve
    listing_id = Column(
        Integer,
        ForeignKey("listings.id", ondelete="CASCADE"),
        nullable=False
    )

    # 🔥 modern storage megoldás
    # pl: photos/user123/abc123.webp
    cdn_key = Column(String, nullable=False)

    # 🔥 teljes URL 
    url = Column(String, nullable=False)

    filename = Column(String, nullable=False)

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    is_main = Column(Boolean, default=False, nullable=False)

    # kapcsolat vissza a listingre
    listing = relationship("Listing", back_populates="images")
