export default function HeaderRow() {
  return (
    <section className="header-row">
      <div className="header-title-box">
        <button type="button" className="back-button" aria-label="Вернуться назад">
          ←
        </button>
        <div className="header-text-group">
          <h1 className="page-title">Выберите дату и время</h1>
          <p className="page-subtitle">Мастер: Дмитрий • Мужская стрижка (45 мин)</p>
        </div>
      </div>
    </section>
  );
}
