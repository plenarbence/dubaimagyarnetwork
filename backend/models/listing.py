from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Enum,
    JSON,
)
from sqlalchemy.orm import relationship
from database import Base
import enum


# ===========================
# ✅ Listing status enum
# ===========================
class ListingStatus(str, enum.Enum):
    pending_admin = "pending_admin"        # beküldve, admin review alatt
    awaiting_payment = "awaiting_payment"  # jóváhagyva, fizetésre vár
    active = "active"                      # fizetve, publikálva
    expired = "expired"                    # lejárt, nem aktív
    rejected = "rejected"                  # visszadobva admin által
    draft = "draft"                        # piszkozat


# ===========================
# ✅ Listing model
# ===========================
class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)  # limitálva 100 karakterre

    # hosszú rich text leírás (HTML formában tárolva)
    description = Column(Text, nullable=False)  # max. 1000 karakter frontenden limitálva

    # timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    visibility_until = Column(DateTime, nullable=True)

    # státusz
    status = Column(Enum(ListingStatus), default=ListingStatus.draft, nullable=False)

    # kapcsolatok
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    # admin megjegyzés
    admin_comment = Column(String(500), nullable=True)

    # opcionális elérhetőségek
    email = Column(String(255), nullable=True)
    phone_number = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    whatsapp = Column(String(100), nullable=True)
    instagram = Column(String(255), nullable=True)
    tiktok = Column(String(255), nullable=True)
    facebook = Column(String(255), nullable=True)
    youtube = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)

    # új mezők
    company = Column(String(255), nullable=True)  # opcionális cég / brand név
    tags = Column(JSON, nullable=True)            # opcionális kulcsszavak listája (max 5 db, 50 karakter)

    # kapcsolatok
    user = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    images = relationship("Image", back_populates="listing", cascade="all, delete-orphan")
