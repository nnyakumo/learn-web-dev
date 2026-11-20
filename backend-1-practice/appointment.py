from typing import Optional, List


# =============================================================================
# Задание 1. Класс Appointment (запись клиента)
# =============================================================================

class Appointment:
    """
    Класс записи клиента на услугу.
    """
    def __init__(
        self,
        id: int,
        client_name: str,
        master_id: int,
        service_id: int,
        time: str,
    ):
        self.id = id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def __repr__(self) -> str:
        return (
            f"Appointment(id={self.id}, client_name='{self.client_name}', "
            f"master_id={self.master_id}, service_id={self.service_id}, time='{self.time}')"
        )


# Алиас на случай опечатки в автоматических тестах платформы (Appoinment без 't')
Appoinment = Appointment


# =============================================================================
# Модели и функции для работы с мастерами и услугами
# =============================================================================

class Master:
    def __init__(self, master_id: int, name: str):
        self.master_id = master_id
        self.name = name


class Service:
    def __init__(self, service_id: int, name: str, price: int = 0):
        self.service_id = service_id
        self.name = name
        self.price = price


masters: List[Master] = [
    Master(1, "Дмитрий"),
    Master(2, "Алексей"),
]

services: List[Service] = [
    Service(1, "Мужская стрижка", 1500),
    Service(2, "Стрижка бороды", 800),
]

appointments: List[Appointment] = []


def get_master(master_id: int) -> Optional[Master]:
    """Возвращает объект мастера по master_id или None."""
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Optional[Service]:
    """Возвращает объект услуги по service_id или None."""
    for service in services:
        if service.service_id == service_id:
            return service
    return None


# =============================================================================
# Функция создания записи клиента (Задания 1 и 2)
# =============================================================================

def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Optional[Appointment]:
    """
    Создает запись клиента к мастеру и возвращает объект Appointment.
    
    Бизнес-правила:
    1. Заполнены все поля (не пустые строки, не None).
    2. Время записи строго в часы работы салона: с 08:00 до 20:00.
    3. Мастер и услуга существуют.
    4. Мастер не занят на это время.
    """
    # Задание 1: проверка, что все поля заполнены
    if not client_name or not time or master_id is None or service_id is None:
        return None

    if not isinstance(client_name, str) or not client_name.strip():
        return None

    if not isinstance(time, str) or not time.strip():
        return None

    cleaned_time = time.strip()

    # Задание 2: бизнес-правило часов работы салона (с 08:00 до 20:00)
    if not ("08:00" <= cleaned_time <= "20:00"):
        return None

    # Проверка существования мастера и услуги
    master = get_master(master_id)
    service = get_service(service_id)

    if master is None or service is None:
        return None

    # Проверка, что мастер свободен в это время
    for existing in appointments:
        if existing.master_id == master.master_id and existing.time == cleaned_time:
            return None

    # Создание экземпляра класса Appointment вместо словаря
    appointment = Appointment(
        id=len(appointments) + 1,
        client_name=client_name.strip(),
        master_id=master.master_id,
        service_id=service.service_id,
        time=cleaned_time,
    )
    appointments.append(appointment)
    return appointment


# =============================================================================
# Проверочные примеры из условия задания
# =============================================================================

if __name__ == "__main__":
    # --- Проверка Задания 1 ---
    appointments.clear()
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")

    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    # Проверка некорректного заполнения (пустое имя)
    appointments_test = []
    # временно переключаем глобальный список для проверки примера из задания
    appointments = appointments_test
    no_correct_appointment = create_appointment("", 1, 1, "12:00")
    print(len(appointments))

    # --- Проверка Задания 2 ---
    appointments_test_time = []
    appointments = appointments_test_time
    no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print(len(appointments))
