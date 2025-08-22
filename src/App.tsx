// App.tsx
import React, {useEffect, useState} from 'react';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import MainScreen from './components/MainScreen';
import {PlayerService} from "./api/playerService";
import RegistrationScreen from "./components/RegistrationScreen";
import {usePlayer} from "./contexts/PlayerContext";
import {TelegramService} from "./services/telegramService";
import {useTelegramTheme} from './hooks/useTelegramTheme'; // Добавляем импорт
import { PopupContainer } from './components/PopupContainer';
import './styles/popups.css'; // Добавляем импорт CSS

const App: React.FC = () => {
    const {player, setPlayer, setTelegramId} = usePlayer();
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [isNewPlayer, setIsNewPlayer] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);

    // Используем хук темы - это самое важное изменение!
    const theme = useTelegramTheme();

    useEffect(() => {
        const initApp = async () => {
            try {
                // Инициализируем Telegram WebApp
                TelegramService.init();
                TelegramService.expand();

                let telegramUserId = TelegramService.getUserId();
                if (!telegramUserId) {
                    telegramUserId = Math.floor(Math.random() * (100000 - 1 + 1)) + 1
                }

                setTelegramId(telegramUserId);

                await new Promise(resolve => setTimeout(resolve, 1000));

                const playerData = await PlayerService.getByTelegramId(telegramUserId);
                setIsLoading(false);

                if (!playerData) {
                    setIsNewPlayer(true);
                    return;
                }

                setPlayer(playerData);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : '! ошибка';
                setErrorText(errorMessage);

            } finally {
                setIsLoading(false);
            }
        };

        initApp();
    }, []);

    // Обработчик успешной регистрации
    const handleRegistrationSuccess = () => {
        setRegistrationComplete(true);
    };

    const renderContent = () => {
        if (registrationComplete) return <MainScreen/>;
        if (isLoading) return <LoadingScreen/>;
        if (isNewPlayer) return <RegistrationScreen onRegistrationSuccess={handleRegistrationSuccess}/>;
        if (errorText) return <ErrorScreen message={errorText}/>;
        return <MainScreen/>;
    };

    return (
        <>
            {renderContent()}
            <PopupContainer/> {/* Всегда отображаем контейнер для popup'ов */}
        </>
    );
};

export default App;