from sqlalchemy import Column, Integer, String, Float
from database import Base


class Master(Base):
    """SQLAlchemy-модель мастера."""
    __tablename__ = "masters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    specialization = Column(String, nullable=False)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "specialization": self.specialization,
        }


class Service(Base):
    """
    SQLAlchemy-модель услуги салона красоты.
    Таблица 'services'.
    """
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    desc = Column(String(100), nullable=False)
    duration = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    @property
    def categoryId(self):
        return self.category_id

    @categoryId.setter
    def categoryId(self, value):
        self.category_id = value

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "categoryId": self.category_id,
            "title": self.title,
            "desc": self.desc,
            "duration": self.duration,
            "price": self.price,
        }
