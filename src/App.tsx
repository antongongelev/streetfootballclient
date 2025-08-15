import {useEffect} from "react";
import TelegramUserInfo from "./components/TelegramUserInfo";
import MapWithLocation from "./components/MapWithLocation";

function App() {
    useEffect(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.expand();
        }
    }, []);

    return (
        <div className="app">
            <TelegramUserInfo/>
            <MapWithLocation/>
        </div>
    );
}

export default App;