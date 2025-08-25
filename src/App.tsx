// App.tsx
import React, {useEffect, useState} from 'react';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import MainScreen from './components/MainScreen';
import {PlayerService} from "./api/playerService";
import RegistrationScreen from "./components/RegistrationScreen";
import {useApplicationContext} from "./contexts/PlayerContext";
import {TelegramService} from "./services/telegramService";
import {PopupContainer} from './components/PopupContainer';

const App: React.FC = () => {
    const {setPlayer, setTelegramUser} = useApplicationContext();
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [isNewPlayer, setIsNewPlayer] = useState(false);

    useEffect(() => {
        const initApp = async () => {
            try {
                // Инициализируем Telegram
                TelegramService.init();

                // Получаем пользователя Telegram
                const telegramUser = await TelegramService.getUser();
                if (!telegramUser) {
                    throw new Error('Не удалось получить данные пользователя Telegram');
                }
                setTelegramUser(telegramUser);

                // Получаем данные игрока
                const playerData = await PlayerService.getByTelegramId(telegramUser.id);

                if (!playerData) {
                    setIsNewPlayer(true);
                    return
                }

                setPlayer(playerData);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
                setErrorText(errorMessage);
                setIsNewPlayer(true)

            } finally {
                setIsLoading(false);
            }
        };

        initApp();
    }, [setPlayer, setTelegramUser]);

    const handleRegistrationSuccess = () => {
        setIsNewPlayer(false);
    };

    const renderContent = () => {
        if (isLoading) return <LoadingScreen/>;
        if (isNewPlayer) return <RegistrationScreen onRegistrationSuccess={handleRegistrationSuccess}/>;
        if (errorText) return <ErrorScreen message={errorText}/>;
        return <MainScreen/>;
    };

    return (
        <>
            {renderContent()}
            <PopupContainer/>
        </>
    );
};

export default App;