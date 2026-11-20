"""
[Backend] Задание 4.
Pydantic-модели и валидация данных API салона красоты.

Задание 1. Pydantic-модель ServiceCreate:
- categoryId (int)
- title (str, 1..100)
- desc (str, 1..100)
- duration (int, 30..180)
- price (float, > 0)

Задание 2. Реализация API:
- POST /services (код 201) — добавление новой услуги в БД через Pydantic-модель ServiceCreate.
"""

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal, get_db
from models import Master, Service
from schemas import ServiceCreate

# Создание всех таблиц в SQLite БД
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Salon API with Pydantic & SQLAlchemy")


def init_db():
    """Заполнение начальными данными при первом старте."""
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
# Задание 2. POST /services (Создание услуги с валидацией через ServiceCreate)
# ---------------------------------------------------------------------------
@app.post("/services", status_code=201)
def create_service(service_data: ServiceCreate, db: Session = Depends(get_db)):
    """
    Добавить новую услугу в БД согласно валидированной Pydantic-модели ServiceCreate.
    При успехе возвращает созданную запись с кодом 201.
    При некорректных данных FastAPI автоматически возвращает 422 Unprocessable Entity.
    """
    new_service = Service(
        category_id=service_data.categoryId,
        title=service_data.title,
        desc=service_data.desc,
        duration=service_data.duration,
        price=service_data.price,
    )
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service.to_dict()


@app.get("/services")
def get_services(db: Session = Depends(get_db)):
    """Получить список всех услуг из БД."""
    services = db.query(Service).all()
    return [s.to_dict() for s in services]


# ---------------------------------------------------------------------------
# Эндпоинты для мастеров (из Задания 3)
# ---------------------------------------------------------------------------
@app.get("/masters")
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Master)
    if specialization:
        query = query.filter(Master.specialization == specialization)
    masters = query.all()
    return [m.to_dict() for m in masters]


@app.get("/masters/{master_id}")
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.query(Master).filter(Master.id == master_id).first()
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master.to_dict()


# ---------------------------------------------------------------------------
# Категории услуг (из Задания 2)
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
