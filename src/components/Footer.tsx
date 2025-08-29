// Footer.tsx
import React from 'react';
import "./../styles/footer.css"; // Будем использовать отдельный CSS файл

interface FooterProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Footer: React.FC<FooterProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'map', label: 'Карта', icon: '🗺️' },
        { id: 'profile', label: 'Профиль', icon: '👤' },
        { id: 'history', label: 'История', icon: '📊' },
        { id: 'settings', label: 'Настройки', icon: '⚙️' }
    ];

    return (
        <footer className="footer">
            <div className="footer-switch">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`footer-option ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <span className="footer-icon">{tab.icon}</span>
                        <span className="footer-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </footer>
    );
};

export default Footer;