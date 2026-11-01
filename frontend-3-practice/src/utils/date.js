// ==========================================================================
// Чистые функции и данные для работы с датами и слотами
// ==========================================================================

export const SERVER_DATA = {
  today: { day: 10, month: 5, year: 2025 }, // 10 июня 2025 года (месяц 0-индексный: 5 = Июнь)
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

export const SLOTS_EVEN_DAY = [
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

export const SLOTS_ODD_DAY = [
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

export const MONTHS_NOMINATIVE = [
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

export const MONTHS_GENITIVE = [
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

export const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

/**
 * Сравнение двух дат { day, month, year }
 */
export function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

/**
 * Проверка «не раньше сегодня»
 */
export function isDateSelectable(day, month, year, today = SERVER_DATA.today) {
  return compareDates({ day, month, year }, today) >= 0;
}

/**
 * Получение слотов для конкретного дня
 */
export function getSlotsForDay(day, month, year) {
  const isEven = day % 2 === 0;
  const slots = isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
  return { day, month, year, slots: JSON.parse(JSON.stringify(slots)) };
}

/**
 * Построение сетки календаря (массив недель по 7 ячеек)
 */
export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Неделя начинается с понедельника
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
