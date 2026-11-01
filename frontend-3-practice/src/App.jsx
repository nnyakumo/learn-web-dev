import { useState } from "react";
import Navbar from "./components/Navbar";
import StepIndicator from "./components/StepIndicator";
import HeaderRow from "./components/HeaderRow";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BottomBar from "./components/BottomBar";
import Footer from "./components/Footer";
import { getSlotsForDay, MONTHS_GENITIVE } from "./utils/date";

export default function App() {
  // 5 значений состояния по ТЗ:
  // 1. currentMonth — текущий отображаемый месяц (0-индексный, 5 = Июнь)
  // 2. currentYear — текущий год
  // 3. selectedDay — выбранный день
  // 4. selectedTime — выбранное время (по умолчанию "14:00")
  // 5. slots — список доступных и занятых слотов
  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2025);
  const [selectedDay, setSelectedDay] = useState(18);
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [slots, setSlots] = useState(() => getSlotsForDay(18, 5, 2025).slots);

  // Клик по дню: обновляем день, сбрасываем время и получаем слоты
  function handleDayClick(day) {
    setSelectedDay(day);
    // ОБЯЗАТЕЛЬНОЕ ТРЕБОВАНИЕ ТЗ: сброс выбранного времени при смене дня!
    setSelectedTime(null);
    const newSlots = getSlotsForDay(day, currentMonth, currentYear).slots;
    setSlots(newSlots);
  }

  // Клик по слоту времени
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Перелистывание месяца назад
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  }

  // Перелистывание месяца вперёд
  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  }

  // Нажатие на кнопку «Продолжить →»
  function handleContinue() {
    if (!selectedTime) {
      alert("Пожалуйста, выберите доступное время визита перед тем, как продолжить.");
      return;
    }

    const monthName = MONTHS_GENITIVE[currentMonth];
    alert(
      `Выбрана дата и время визита:\n${selectedDay} ${monthName} ${currentYear} в ${selectedTime}\n\nПереход к следующему шагу.`
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="booking-layout">
        <StepIndicator />
        <HeaderRow />

        <div className="calendar-time-layout">
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedDay={selectedDay}
            onDayClick={handleDayClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onTimeClick={handleTimeClick}
          />
        </div>

        <BottomBar
          selectedDay={selectedDay}
          currentMonth={currentMonth}
          currentYear={currentYear}
          selectedTime={selectedTime}
          onContinue={handleContinue}
        />
      </main>

      <Footer />
    </div>
  );
}
