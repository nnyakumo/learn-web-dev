export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        {/* Колонка 1: Бренд */}
        <div className="footer-col brand-col">
          <h3 className="footer-brand-title">МАГИЯ СТИЛЯ</h3>
          <p className="footer-brand-desc">
            Стрижки, окрашивание и премиум уход от лучших мастеров в центре
            Москвы. Безупречный стиль и комфорт.
          </p>
        </div>

        {/* Колонка 2: Контакты */}
        <div className="footer-col">
          <h4 className="footer-col-title">КОНТАКТЫ</h4>
          <ul className="footer-list">
            <li className="footer-list-item">📍 ул. Садовая, 15, Москва</li>
            <li className="footer-list-item">📞 +7 (495) 123-45-67</li>
            <li className="footer-list-item">✉️ info@magiastyle.ru</li>
          </ul>
        </div>

        {/* Колонка 3: Режим работы */}
        <div className="footer-col">
          <h4 className="footer-col-title">РЕЖИМ РАБОТЫ</h4>
          <ul className="footer-list">
            <li className="footer-list-item">Пн–Пт: 9:00 – 21:00</li>
            <li className="footer-list-item">Сб–Вс: 10:00 – 19:00</li>
            <li className="footer-list-item">Без перерывов и выходных</li>
          </ul>
        </div>
      </div>

      {/* Нижняя полоса копирайта */}
      <div className="footer-bottom">
        <span className="footer-copy">
          © 2026 Салон «Магия Стиля». Все права защищены.
        </span>
        <a href="#" className="footer-privacy-link">
          Политика конфиденциальности
        </a>
      </div>
    </footer>
  );
}
