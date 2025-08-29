// Footer.tsx
import React from 'react';
import "./../styles/footer.css";

// Импортируем иконки
import MapIcon from '../assets/icons/footer_map.png';
import ProfileIcon from '../assets/icons/footer_profile.png';
import EventsIcon from '../assets/icons/footer_events.png';
import SettingsIcon from '../assets/icons/footer_settings.png';

interface FooterProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Footer: React.FC<FooterProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'map', label: 'Карта', icon: MapIcon },
        { id: 'profile', label: 'Профиль', icon: ProfileIcon },
        { id: 'events', label: 'События', icon: EventsIcon },
        { id: 'settings', label: 'Настройки', icon: SettingsIcon }
    ];

    return (
        <footer className="footer">
            <div className="footer-switch">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`footer-option ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        title={tab.label} // Добавляем title для accessibility
                    >
                        <img
                            src={tab.icon}
                            alt={tab.label}
                            className="footer-icon"
                        />
                        <span className="footer-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </footer>
    );
};

export default Footer;