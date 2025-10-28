from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    order_index = Column(Integer, default=0)

    # kapcsolat az alkategóriákkal
    parent = relationship("Category", remote_side=[id], backref="children")

    # kapcsolat a Listing modellel (bidirectional kapcsolat)
    listings = relationship("Listing", back_populates="category")

    def __repr__(self):
        return f"<Category id={self.id} name='{self.name}' parent_id={self.parent_id}>"
