export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand-logo">
        <svg
          className="brand-icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f5b214"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
        <span className="brand-title">МАГИЯ СТИЛЯ</span>
      </div>
      <nav className="nav-links">
        <a href="#" className="nav-link">Услуги</a>
        <a href="#" className="nav-link">Галерея</a>
        <a href="#" className="nav-link">Команда</a>
        <a href="#" className="nav-link">Отзывы</a>
        <a href="#" className="nav-link">Контакты</a>
      </nav>
      <button type="button" className="login-button">
        Войти
      </button>
    </header>
  );
}
