from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.database import Base


class Category(Base):
    """
    Category model representing a hierarchical category tree.
    Each category can have a parent and multiple children.
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    parent_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=True)
    order_index = Column(Integer, default=0, nullable=False)

    # --- Relationships ---
    parent = relationship(
        "Category",
        remote_side=[id],
        back_populates="children",
        passive_deletes=True,
    )
    children = relationship(
        "Category",
        back_populates="parent",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="Category.order_index"
    )
    """
    listings = relationship(
        "Listing",
        back_populates="category",
        cascade="all, delete",
        passive_deletes=True,
    )
    """
    
    def __repr__(self):
        return f"<Category(id={self.id}, name='{self.name}', parent_id={self.parent_id})>"
