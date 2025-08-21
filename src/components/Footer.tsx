import React from 'react';

interface FooterProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Footer: React.FC<FooterProps> = ({ activeTab, onTabChange }) => {
    return (
        <footer className="footer">
            <button
                className={`footer-button ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => onTabChange('map')}
            >
                🗺️ Карта
            </button>
            <button
                className={`footer-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => onTabChange('profile')}
            >
                👤 Профиль
            </button>
            <button
                className={`footer-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => onTabChange('history')}
            >
                📊 История
            </button>
            <button
                className={`footer-button ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
            >
                ⚙️ Настройки
            </button>
        </footer>
    );
};

export default Footer;