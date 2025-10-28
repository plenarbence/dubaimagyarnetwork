from datetime import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from database import Base
import enum


# ===========================
# ✅ Listing status enum
# ===========================
class ListingStatus(str, enum.Enum):
    pending_admin = "pending_admin"     # beküldve, admin review alatt
    awaiting_payment = "awaiting_payment"  # jóváhagyva, fizetésre vár
    active = "active"                   # fizetve, publikálva
    expired = "expired"                 # lejárt, nem aktív
    rejected = "rejected"               # visszadobva admin által


# ===========================
# ✅ Listing model
# ===========================
class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    # timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    visibility_until = Column(DateTime, nullable=True)

    # status flow
    status = Column(Enum(ListingStatus), default=ListingStatus.pending_admin, nullable=False)

    # relations
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)

    # admin feedback
    admin_comment = Column(Text, nullable=True)

    # relationships
    user = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")


# ===========================
# ✅ Back-populate the relation in User and Category models
# (Ezt ott kell majd hozzáadni a másik két file-hoz:)
# User: listings = relationship("Listing", back_populates="user")
# Category: listings = relationship("Listing", back_populates="category")
# ===========================
