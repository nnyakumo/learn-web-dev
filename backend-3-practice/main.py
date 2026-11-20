"""
[Backend] Задание 3.
Перенос хранения мастеров в SQLite БД и реализация API через SQLAlchemy.

Задание 1. Модель Master (таблица 'masters'): id, name, specialization.
Задание 2. API-методы:
- GET /masters — получить список всех мастеров из БД
- GET /masters?specialization=Парикмахер — фильтрация по специализации
- GET /masters/{master_id} — получить мастера по id (или 404 Not Found)
"""

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal, get_db
from models import Master

# Создаем таблицы в SQLite базе данных
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salon API with SQLite & SQLAlchemy")


def init_db():
    """Заполнение начальными тестовыми данными, если таблица пуста."""
    db = SessionLocal()
    try:
        if db.query(Master).count() == 0:
            initial_masters = [
                Master(id=1, name="Анна", specialization="Парикмахер"),
                Master(id=2, name="Мария", specialization="Визажист"),
            ]
            db.add_all(initial_masters)
            db.commit()
    finally:
        db.close()


init_db()


# ---------------------------------------------------------------------------
# Задание 2. API для мастеров
# ---------------------------------------------------------------------------
@app.get("/masters")
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    """
    Получить список всех мастеров из таблицы базы данных.
    Если передан query-параметр specialization, возвращает только мастеров указанной специализации:
    GET /masters?specialization=Парикмахер
    """
    query = db.query(Master)
    if specialization:
        query = query.filter(Master.specialization == specialization)
    masters = query.all()
    return [master.to_dict() for master in masters]


@app.get("/masters/{master_id}")
def get_master(master_id: int, db: Session = Depends(get_db)):
    """
    Получить одного мастера по его id из таблицы БД.
    Если мастер не найден — возвращает 404 Not Found.
    """
    master = db.query(Master).filter(Master.id == master_id).first()
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master.to_dict()


# ---------------------------------------------------------------------------
# Категории услуг (из предыдущего модуля)
# ---------------------------------------------------------------------------
categories = [
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
]


@app.get("/categories")
def get_categories():
    return categories


@app.get("/categories/{category_id}")
def get_category(category_id: int):
    for category in categories:
        if category["id"] == category_id:
            return category
    raise HTTPException(status_code=404, detail="Category not found")
