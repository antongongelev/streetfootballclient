// MainScreen.tsx
import Footer from "./Footer";
import MapPage from "../pages/MapPage";
import SettingsPage from "../pages/SettingsPage";
import EventsPage from "../pages/EventsPage";
import ProfilePage from "../pages/ProfilePage";
import {useState} from "react";

const MainScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState('map');

    const renderPage = () => {
        switch (activeTab) {
            case 'map': return <MapPage />;
            case 'profile': return <ProfilePage />;
            case 'events': return <EventsPage />;
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