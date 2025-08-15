import { NavLink } from 'react-router-dom';
import '../styles/Footer.css'; // Стили подключим ниже

export default function Footer() {

    return (
        <footer className="app-footer">
            <NavLink
                to="/map"
                className={({ isActive }) => isActive ? 'footer-item active' : 'footer-item'}
            >
                <span className="icon">🗺️</span>
                <span>Карта</span>
            </NavLink>

            <NavLink
                to="/events"
                className={({ isActive }) => isActive ? 'footer-item active' : 'footer-item'}
            >
                <span className="icon">📅</span>
                <span>События</span>
            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? 'footer-item active' : 'footer-item'}
            >
                <span className="icon">👤</span>
                <span>Профиль</span>
            </NavLink>

            <NavLink
                to="/settings"
                className={({ isActive }) => isActive ? 'footer-item active' : 'footer-item'}
            >
                <span className="icon">⚙️</span>
                <span>Настройки</span>
            </NavLink>
        </footer>
    );
}