import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StepIndicator from "./components/StepIndicator";
import HeaderRow from "./components/HeaderRow";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BottomBar from "./components/BottomBar";
import Footer from "./components/Footer";
import { fetchToday, fetchSlots } from "./api";
import { MONTHS_GENITIVE } from "./utils/date";

export default function App() {
  // ==========================================================================
  // 1. Состояние контрольной даты с сервера (Today)
  // ==========================================================================
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [errorToday, setErrorToday] = useState(null);

  // ==========================================================================
  // 2. Состояние отображения и выбора
  // ==========================================================================
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // ==========================================================================
  // 3. Состояние слотов времени с сервера
  // ==========================================================================
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errorSlots, setErrorSlots] = useState(null);

  // Триггер для повторной попытки загрузки Today
  const [retryTodayCount, setRetryTodayCount] = useState(0);

  // --------------------------------------------------------------------------
  // Шаг 1: Загрузка контрольной даты «сегодня» при открытии страницы
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function loadTodayData() {
      try {
        setErrorToday(null);
        const data = await fetchToday();

        if (!isCancelled) {
          setToday(data);
          // Инициализируем календарь на месяц и день, полученные с сервера
          setCurrentMonth(data.month);
          setCurrentYear(data.year);
          setSelectedDay(data.day);
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorToday(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoadingToday(false);
        }
      }
    }

    loadTodayData();

    return () => {
      isCancelled = true;
    };
  }, [retryTodayCount]);

  // --------------------------------------------------------------------------
  // Шаг 2: Загрузка слотов при смене выбранного дня (с защитой от гонок)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!selectedDay || currentMonth === null || currentYear === null) {
      return;
    }

    let isCancelled = false;

    async function loadDaySlots() {
      try {
        setErrorSlots(null);

        const response = await fetchSlots({
          day: selectedDay,
          month: currentMonth,
          year: currentYear,
        });

        // Защита от состояния гонки (Race conditions):
        // Сверяем дату из ответа с текущим активным днем и проверяем флаг отмены
        if (!isCancelled && response && response.date) {
          if (
            response.date.day === selectedDay &&
            response.date.month === currentMonth &&
            response.date.year === currentYear
          ) {
            setSlots(response.slots || []);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setErrorSlots(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoadingSlots(false);
        }
      }
    }

    loadDaySlots();

    return () => {
      isCancelled = true;
    };
  }, [selectedDay, currentMonth, currentYear]);

  // --------------------------------------------------------------------------
  // Обработчики действий пользователя
  // --------------------------------------------------------------------------

  // Клик по дню: меняем день, сбрасываем время и включаем индикатор загрузки слотов
  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
    setLoadingSlots(true);
  }

  // Клик по слоту времени
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Навигация по месяцам
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  }

  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  }

  // Повторная попытка загрузки сегодняшней даты
  function handleRetryToday() {
    setLoadingToday(true);
    setRetryTodayCount((prev) => prev + 1);
  }

  // Повторная попытка загрузки слотов при ошибке
  function handleRetrySlots() {
    if (!selectedDay || currentMonth === null || currentYear === null) return;
    setLoadingSlots(true);
    setErrorSlots(null);
    fetchSlots({ day: selectedDay, month: currentMonth, year: currentYear })
      .then((res) => {
        setSlots(res.slots || []);
      })
      .catch((err) => {
        setErrorSlots(err.message);
      })
      .finally(() => {
        setLoadingSlots(false);
      });
  }

  // Кнопка «Продолжить →»
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

        {loadingToday ? (
          <div className="main-loading-state">
            <div className="spinner large"></div>
            <p className="loading-text">Загрузка данных календаря с сервера…</p>
          </div>
        ) : errorToday ? (
          <div className="main-error-state">
            <span className="error-icon">⚠️</span>
            <p className="error-title">Ошибка при подключении к серверу</p>
            <p className="error-desc">{errorToday}</p>
            <button type="button" className="retry-main-btn" onClick={handleRetryToday}>
              Повторить попытку
            </button>
          </div>
        ) : (
          <div className="calendar-time-layout">
            <Calendar
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDay={selectedDay}
              today={today}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <TimeSlots
              slots={slots}
              selectedTime={selectedTime}
              loading={loadingSlots}
              error={errorSlots}
              onTimeClick={handleTimeClick}
              onRetry={handleRetrySlots}
            />
          </div>
        )}

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
