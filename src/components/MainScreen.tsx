import React, { useState } from 'react';
import Footer from './Footer';
import MapPage from '../pages/MapPage';
import ProfilePage from '../pages/ProfilePage';
import HistoryPage from '../pages/HistoryPage';
import SettingsPage from '../pages/SettingsPage';
import '../styles/global.css';

const MainScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('map');

    const renderPage = () => {
        switch (activeTab) {
            case 'map': return <MapPage />;
            case 'profile': return <ProfilePage />;
            case 'history': return <HistoryPage />;
            case 'settings': return <SettingsPage />;
            default: return <MapPage />;
        }
    };

    return (
        <div className="main-screen">
            <div className="content">{renderPage()}</div>
            <Footer activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
};

export default MainScreen;