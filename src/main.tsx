// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PlayerProvider } from "./contexts/ApplicationContext";
import { PopupProvider } from "./contexts/PopupContext";
import './styles/popups.css';
import './styles/footer.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PlayerProvider>
            <PopupProvider> {/* Оборачиваем в PopupProvider */}
                <App/>
            </PopupProvider>
        </PlayerProvider>
    </React.StrictMode>
);