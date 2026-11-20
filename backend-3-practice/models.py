from sqlalchemy import Column, Integer, String
from database import Base


class Master(Base):
    """
    SQLAlchemy-модель мастера салона красоты (таблица 'masters').
    Поля:
    - id: уникальный идентификатор (PK)
    - name: имя мастера
    - specialization: специализация мастера (например, 'Парикмахер', 'Визажист')
    """
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
