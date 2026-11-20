"""
[Backend] Задание 2.
Реализация Endpoint'ов на FastAPI для салона красоты.

Задание 1. Список категорий:
GET /categories -> возвращает список всех категорий услуг с количеством услуг (servicesCount).

Задание 2. Информация по категории:
GET /categories/{category_id} -> возвращает информацию о конкретной категории услуг (код 200)
или ошибку 404 (Category not found), если категория с таким id не найдена.
"""

from fastapi import FastAPI, HTTPException

app = FastAPI(title="Salon API")

# ---------------------------------------------------------------------------
# Данные категорий услуг (Задания 1 и 2)
# ---------------------------------------------------------------------------
categories = [
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
]


# ---------------------------------------------------------------------------
# Эндпоинты из Лекции 2
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"message": "Salon API"}


@app.get("/masters")
def get_masters():
    return [{"id": 1, "name": "Анна"}, {"id": 2, "name": "Мария"}]


@app.get("/masters/{master_id}")
def get_master_endpoint(master_id: int):
    return {"requested_master_id": master_id}


@app.get("/availability")
def availability(time: str, master_id: int = 1):
    return {"master_id": master_id, "time": time}


@app.get("/masters/{master_id}/availability")
def check_availability(master_id: int, time: str):
    return {"master_id": master_id, "time": time}


# ---------------------------------------------------------------------------
# Задание 1. Список категорий
# ---------------------------------------------------------------------------
@app.get("/categories")
def get_categories():
    """
    Возвращает список всех категорий услуг с количеством услуг (servicesCount) в каждой.
    """
    return categories


# ---------------------------------------------------------------------------
# Задание 2. Информация по категории
# ---------------------------------------------------------------------------
@app.get("/categories/{category_id}")
def get_category(category_id: int):
    """
    Возвращает информацию о конкретной категории услуг по её id.
    Если категория не найдена — возвращает 404 (Category not found).
    """
    for category in categories:
        if category["id"] == category_id:
            return category
    raise HTTPException(status_code=404, detail="Category not found")
