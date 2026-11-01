// «База данных» имитационного сервера для салона «Магия Стиля»
export const database = {
  // «Сегодня» по мнению сервера: 18 июня 2025 года (0-индексный месяц: 5 = Июнь)
  today: { day: 18, month: 5, year: 2025 },

  // Слоты для чётных дней (14:00 свободно)
  slotsEvenDay: [
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

  // Слоты для нечётных дней (другие занятые слоты для наглядности смены данных)
  slotsOddDay: [
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
  ],
};
