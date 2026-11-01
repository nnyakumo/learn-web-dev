export default function TimeSlots({
  slots,
  selectedTime,
  loading,
  error,
  onTimeClick,
  onRetry,
}) {
  return (
    <section className="card time-slots-card">
      <h2 className="time-header-title">Доступное время</h2>
      <div className="time-slots-grid">
        {loading ? (
          <div className="slots-loading-state">
            <div className="spinner"></div>
            <span className="state-text">Загрузка слотов…</span>
          </div>
        ) : error ? (
          <div className="slots-error-state">
            <span className="error-icon">⚠️</span>
            <span className="error-text">Не удалось загрузить слоты: {error}</span>
            {onRetry && (
              <button type="button" className="retry-button" onClick={onRetry}>
                Повторить попытку
              </button>
            )}
          </div>
        ) : !slots || slots.length === 0 ? (
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
