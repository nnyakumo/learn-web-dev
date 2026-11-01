import {
  MONTHS_NOMINATIVE,
  buildCalendarGrid,
  isDateSelectable,
} from "../utils/date";

export default function Calendar({
  currentMonth,
  currentYear,
  selectedDay,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  const weeks = buildCalendarGrid(currentYear, currentMonth);

  return (
    <section className="card calendar-card">
      <div className="calendar-header">
        <h2 className="calendar-month-title">
          {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
        </h2>
        <div className="calendar-nav-buttons">
          <button
            type="button"
            className="calendar-arrow-btn calendar-nav-prev"
            onClick={onPrevMonth}
            aria-label="Предыдущий месяц"
          >
            ‹
          </button>
          <button
            type="button"
            className="calendar-arrow-btn calendar-nav-next"
            onClick={onNextMonth}
            aria-label="Следующий месяц"
          >
            ›
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          <span className="weekday">Пн</span>
          <span className="weekday">Вт</span>
          <span className="weekday">Ср</span>
          <span className="weekday">Чт</span>
          <span className="weekday">Пт</span>
          <span className="weekday weekend">Сб</span>
          <span className="weekday weekend">Вс</span>
        </div>

        <div className="calendar-days">
          {weeks.map((week, weekIdx) =>
            week.map((cell, dayIdx) => {
              const isOtherMonth = cell.otherMonth;
              const isToday =
                !isOtherMonth &&
                today &&
                cell.day === today.day &&
                currentMonth === today.month &&
                currentYear === today.year;

              const isSelected =
                !isOtherMonth &&
                cell.day === selectedDay;

              const selectable =
                !isOtherMonth && isDateSelectable(cell.day, currentMonth, currentYear, today);

              let classes = "day-cell";
              if (isOtherMonth) classes += " other-month";
              if (isToday) classes += " today";
              if (isSelected) classes += " selected";
              if (!isOtherMonth && !selectable) classes += " disabled past";

              const isDisabled = isOtherMonth || !selectable;

              return (
                <button
                  key={`${weekIdx}-${dayIdx}`}
                  type="button"
                  className={classes}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      onDayClick(cell.day);
                    }
                  }}
                >
                  {cell.day}
                </button>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
