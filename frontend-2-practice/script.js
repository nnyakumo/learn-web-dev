// ==========================================================================
// Практика 2: Оживление страницы выбора даты и времени (Нативный JavaScript)
// Салон «Магия Стиля»
// ==========================================================================

// ==========================================================================
// 1. ДАННЫЕ
// ==========================================================================

// Имитация ответа сервера:
// today — текущая контрольная дата для проверки блокировки прошедших дней.
// (10 июня 2025 года: дни с 1 по 9 июня блокируются, 18 июня активно)
const SERVER_DATA = {
  today: { day: 10, month: 5, year: 2025 }, // Месяцы 0-индексные: 5 = Июнь
  slots: [
    { time: "10:00", available: true },
    { time: "10:45", available: true },
    { time: "11:30", available: false },
    { time: "12:15", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "15:45", available: true },
    { time: "16:30", available: false },
    { time: "17:15", available: true },
    { time: "18:00", available: true },
    { time: "19:00", available: true },
  ],
};

// Набор слотов для четных дней (для наглядной смены слотов при переключении дней)
const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "10:45", available: true },
  { time: "11:30", available: false },
  { time: "12:15", available: true },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "15:45", available: true },
  { time: "16:30", available: false },
  { time: "17:15", available: true },
  { time: "18:00", available: true },
  { time: "19:00", available: true },
];

// Набор слотов для нечетных дней
const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "11:45", available: true },
  { time: "12:30", available: true },
  { time: "13:15", available: true },
  { time: "14:00", available: false },
  { time: "15:30", available: true },
  { time: "16:15", available: true },
  { time: "17:00", available: false },
  { time: "18:00", available: true },
  { time: "18:45", available: true },
  { time: "19:30", available: true },
];

// Названия месяцев в именительном падеже (для шапки календаря)
const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Названия месяцев в родительном падеже (для нижней строки «18 июня 2025»)
const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Дни недели по стандарту getDay() (0 = Воскресенье)
const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// ==========================================================================
// 2. СОСТОЯНИЕ (STATE)
// ==========================================================================

// Состояние приложения: данные, которые меняются при взаимодействии
const BOOKING_STATE = {
  currentMonth: 5,       // Июнь (0-индексный: 5 = Июнь)
  currentYear: 2025,     // Год календаря
  selectedDay: 18,       // День по умолчанию
  selectedTime: "14:00", // Время по умолчанию (не пустой экран при старте)
};

// ==========================================================================
// 3. ЧИСТЫЕ ФУНКЦИИ
// ==========================================================================

/**
 * Сравнение двух дат { day, month, year } без учета времени.
 * Возвращает:
 *  -1 — date1 раньше date2
 *   0 — даты совпадают
 *   1 — date1 позже date2
 */
function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверка: доступен ли день для выбора (не раньше, чем «сегодня»).
 */
function isDateSelectable(day, month, year) {
  const today = SERVER_DATA.today;
  return compareDates({ day, month, year }, today) >= 0;
}

/**
 * Получение слотов для выбранного дня (имитация backend-запроса).
 */
function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day, month, year, slots: JSON.parse(JSON.stringify(slots)) };
}

/**
 * Построение сетки календаря на месяц.
 * Возвращает массив недель по 7 ячеек { day, otherMonth }.
 */
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Сдвиг для того, чтобы неделя начиналась с понедельника
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  // Дни предыдущего месяца в начале сетки
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  // Дни следующего месяца для завершения последней недели
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  // Разделение плоского массива на недели по 7 дней
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// ==========================================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// ==========================================================================

/**
 * Отрисовка календаря (заголовок месяца и сетка дней)
 */
function renderCalendar() {
  const monthTitleEl = document.querySelector(".calendar-month-title");
  const calendarDaysEl = document.querySelector(".calendar-days");

  if (!monthTitleEl || !calendarDaysEl) return;

  const year = BOOKING_STATE.currentYear;
  const month = BOOKING_STATE.currentMonth;

  // Обновление заголовка месяца: «Июнь 2025»
  monthTitleEl.textContent = `${MONTHS_NOMINATIVE[month]} ${year}`;

  const weeks = buildCalendarGrid(year, month);
  const today = SERVER_DATA.today;

  let html = "";

  weeks.forEach(function (week) {
    week.forEach(function (cell) {
      let classes = "day-cell";
      let disabledAttr = "";

      if (cell.otherMonth) {
        classes += " other-month";
        disabledAttr = "disabled";
      } else {
        // Проверка на «сегодня»
        const isToday =
          cell.day === today.day &&
          month === today.month &&
          year === today.year;
        if (isToday) classes += " today";

        // Проверка на выбранный день
        const isSelected =
          cell.day === BOOKING_STATE.selectedDay &&
          month === BOOKING_STATE.currentMonth &&
          year === BOOKING_STATE.currentYear;
        if (isSelected) classes += " selected";

        // Проверка: можно ли выбрать день (не раньше «сегодня»)
        const selectable = isDateSelectable(cell.day, month, year);
        if (!selectable) {
          classes += " disabled past";
          disabledAttr = "disabled";
        }
      }

      html += `<button type="button" class="${classes}" data-day="${cell.day}" data-other="${cell.otherMonth}" ${disabledAttr}>${cell.day}</button>`;
    });
  });

  calendarDaysEl.innerHTML = html;

  // Навешивание обработчиков клика на активные дни текущего месяца
  const clickableDays = calendarDaysEl.querySelectorAll(
    ".day-cell:not(.other-month):not(.disabled)"
  );

  clickableDays.forEach(function (dayBtn) {
    dayBtn.addEventListener("click", onDayClick);
  });
}

/**
 * Обработчик клика по дню календаря
 */
function onDayClick(event) {
  // Используем currentTarget, чтобы точно получить кнопку ячейки
  const btn = event.currentTarget;
  const day = parseInt(btn.dataset.day, 10);

  BOOKING_STATE.selectedDay = day;

  // ОБЯЗАТЕЛЬНОЕ ТРЕБОВАНИЕ: при смене дня сбрасываем выбранное ранее время!
  BOOKING_STATE.selectedTime = null;

  // Обновляем слоты для нового дня
  const response = getSlotsForDay(
    day,
    BOOKING_STATE.currentMonth,
    BOOKING_STATE.currentYear
  );
  SERVER_DATA.slots = response.slots;

  // Перерисовываем элементы интерфейса
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

/**
 * Отрисовка сетки слотов времени
 */
function renderTimeSlots() {
  const slotsContainer = document.querySelector(".time-slots-grid");
  if (!slotsContainer) return;

  const slots = SERVER_DATA.slots;

  if (!slots || slots.length === 0) {
    slotsContainer.innerHTML =
      '<div class="no-slots-message">В этот день нет свободных слотов для записи</div>';
    return;
  }

  let html = "";

  slots.forEach(function (slot) {
    let classes = "time-slot";
    let disabledAttr = "";

    if (!slot.available) {
      classes += " unavailable";
      disabledAttr = 'disabled title="Слот занят"';
    } else if (slot.time === BOOKING_STATE.selectedTime) {
      classes += " selected";
    }

    html += `<button type="button" class="${classes}" data-time="${slot.time}" ${disabledAttr}>${slot.time}</button>`;
  });

  slotsContainer.innerHTML = html;

  // Навешивание обработчиков клика только на доступные слоты
  const availableSlotBtns = slotsContainer.querySelectorAll(
    ".time-slot:not(.unavailable)"
  );

  availableSlotBtns.forEach(function (slotBtn) {
    slotBtn.addEventListener("click", onTimeSlotClick);
  });
}

/**
 * Обработчик клика по слоту времени
 */
function onTimeSlotClick(event) {
  const btn = event.currentTarget;
  const time = btn.dataset.time;

  BOOKING_STATE.selectedTime = time;

  renderTimeSlots();
  updateBottomBar();
}

/**
 * Обновление строки информации в нижней плашке
 */
function updateBottomBar() {
  const summaryValueEl = document.querySelector(".summary-value");
  if (!summaryValueEl) return;

  const day = BOOKING_STATE.selectedDay;
  const month = BOOKING_STATE.currentMonth;
  const year = BOOKING_STATE.currentYear;

  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  // Форматирование времени: если выбрано — отображаем время, иначе подсказку
  const timePart = BOOKING_STATE.selectedTime
    ? `в ${BOOKING_STATE.selectedTime}`
    : "время не выбрано";

  summaryValueEl.textContent = `${dayName}, ${day} ${monthName} ${year} • ${timePart}`;
}

/**
 * Настройка перелистывания месяцев стрелками «‹» и «›»
 */
function setupMonthNavigation() {
  const prevBtn = document.querySelector(".calendar-nav-prev");
  const nextBtn = document.querySelector(".calendar-nav-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth -= 1;
      if (BOOKING_STATE.currentMonth < 0) {
        BOOKING_STATE.currentMonth = 11;
        BOOKING_STATE.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      BOOKING_STATE.currentMonth += 1;
      if (BOOKING_STATE.currentMonth > 11) {
        BOOKING_STATE.currentMonth = 0;
        BOOKING_STATE.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

/**
 * Обработка нажатия на кнопку «Продолжить →»
 */
function setupContinueButton() {
  const continueBtn = document.querySelector(".cta-continue-button");
  if (!continueBtn) return;

  continueBtn.addEventListener("click", function () {
    if (!BOOKING_STATE.selectedTime) {
      alert("Пожалуйста, выберите доступное время визита перед тем, как продолжить.");
      return;
    }

    const day = BOOKING_STATE.selectedDay;
    const month = MONTHS_GENITIVE[BOOKING_STATE.currentMonth];
    const year = BOOKING_STATE.currentYear;
    const time = BOOKING_STATE.selectedTime;

    alert(`Выбрана дата и время визита:\n${day} ${month} ${year} в ${time}\n\nПереход к следующему шагу.`);
  });
}

// ==========================================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ==========================================================================

function init() {
  // Первичный рендер интерфейса
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();

  // Навешивание слушателей на статические элементы управления
  setupMonthNavigation();
  setupContinueButton();
}

// Запуск инициализации после построения DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
