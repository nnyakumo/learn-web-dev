import { DAYS_OF_WEEK, MONTHS_GENITIVE } from "../utils/date";

export default function BottomBar({
  selectedDay,
  currentMonth,
  currentYear,
  selectedTime,
  onContinue,
}) {
  const dateObj = new Date(currentYear, currentMonth, selectedDay);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[currentMonth];

  const timePart = selectedTime ? `в ${selectedTime}` : "время не выбрано";

  return (
    <section className="bottom-cta-bar">
      <div className="summary-info">
        <span className="summary-label">Выбранное время визита</span>
        <span className="summary-value">
          {dayName}, {selectedDay} {monthName} {currentYear} • {timePart}
        </span>
      </div>
      <button
        type="button"
        className="cta-continue-button"
        onClick={onContinue}
      >
        Продолжить →
      </button>
    </section>
  );
}
