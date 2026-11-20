"""
Pydantic-схемы для валидации данных салона красоты.
"""

from pydantic import BaseModel, Field, field_validator


class ServiceCreate(BaseModel):
    """
    Pydantic-модель для создания новой услуги (Задание 1).
    Поля и ограничения:
    - categoryId: идентификатор категории
    - title: название услуги (не пустое, макс. 100 символов)
    - desc: описание услуги (не пустое, макс. 100 символов)
    - duration: продолжительность (мин. 30 минут, макс. 3 часа = 180 минут)
    - price: стоимость (больше 0, не может быть <= 0)
    """
    categoryId: int = Field(..., description="Идентификатор категории")
    title: str = Field(..., min_length=1, max_length=100, description="Название услуги")
    desc: str = Field(..., min_length=1, max_length=100, description="Описание услуги")
    duration: int = Field(..., ge=30, le=180, description="Продолжительность услуги (минут)")
    price: float = Field(..., gt=0, description="Стоимость услуги (> 0)")

    @field_validator("title", "desc")
    @classmethod
    def validate_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Поле не может быть пустым или состоять только из пробелов")
        return value
