from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Enum,
    Boolean,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from backend.database import Base
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

    # ---------------------------------------
    # 🧾 Alapadatok
    # ---------------------------------------
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(70), nullable=False)           # max. 70 karakter
    description = Column(Text, nullable=False)            
    status = Column(Enum(ListingStatus), default=ListingStatus.draft, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    visibility_until = Column(DateTime, nullable=True)

    # ---------------------------------------
    # 👤 Kapcsolatok (user / kategória)
    # ---------------------------------------
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    user = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    images = relationship("Image", back_populates="listing", cascade="all, delete-orphan")
    ratings = relationship("Rating", back_populates="listing", cascade="all, delete-orphan")


    # ---------------------------------------
    # 🏢 Üzleti és elérhetőségi adatok
    # ---------------------------------------
    company = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone_number = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    whatsapp = Column(String(100), nullable=True)
    instagram = Column(String(255), nullable=True)
    tiktok = Column(String(255), nullable=True)
    facebook = Column(String(255), nullable=True)
    youtube = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    tags = Column(JSONB, nullable=True)  # opcionális kulcsszavak listája

    # ---------------------------------------
    # 🧠 Admin információk
    # ---------------------------------------
    admin_comment = Column(String(500), nullable=True)
    admin_featured = Column(Boolean, default=False, nullable=False)


    # ---------------------------------------
    # 💰 Kiemelt (sponsored) adatok
    # ---------------------------------------
    featured_from = Column(DateTime, nullable=True)
    featured_until = Column(DateTime, nullable=True)

    # helper property (nem oszlop!)
    @property
    def is_featured(self) -> bool:
        """Igaz, ha az aktuális dátum a featured időszakon belül van."""
        if self.featured_from and self.featured_until:
            return self.featured_from <= datetime.utcnow() <= self.featured_until
        return False

    # ---------------------------------------
    # 📊 Gombnyomás alapú counterek (clicks)
    # ---------------------------------------
    click_counter = Column(Integer, default=0)                # hirdetésre kattintások
    click_counter_featured = Column(Integer, default=0)      # featured megjelenésből érkező kattintások

    click_website = Column(Integer, default=0)
    click_email = Column(Integer, default=0)
    click_phone = Column(Integer, default=0)
    click_whatsapp = Column(Integer, default=0)
    click_instagram = Column(Integer, default=0)
    click_tiktok = Column(Integer, default=0)
    click_facebook = Column(Integer, default=0)
    click_youtube = Column(Integer, default=0)
