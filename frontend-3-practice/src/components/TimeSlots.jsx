export default function TimeSlots({ slots, selectedTime, onTimeClick }) {
  return (
    <section className="card time-slots-card">
      <h2 className="time-header-title">Доступное время</h2>
      <div className="time-slots-grid">
        {!slots || slots.length === 0 ? (
          <div className="no-slots-message">
            В этот день нет свободных слотов для записи
          </div>
        ) : (
          slots.map((slot) => {
            let classes = "time-slot";
            const isUnavailable = !slot.available;
            const isSelected = slot.time === selectedTime && slot.available;

            if (isUnavailable) classes += " unavailable";
            if (isSelected) classes += " selected";

            return (
              <button
                key={slot.time}
                type="button"
                className={classes}
                disabled={isUnavailable}
                title={isUnavailable ? "Слот занят" : `Выбрать ${slot.time}`}
                onClick={() => {
                  if (!isUnavailable) {
                    onTimeClick(slot.time);
                  }
                }}
              >
                {slot.time}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
