import React, {useEffect, useState} from 'react';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import MainScreen from './components/MainScreen';
import {PlayerService} from "./api/playerService";
import RegistrationScreen from "./components/RegistrationScreen";
import {usePlayer} from "./contexts/PlayerContext";

const App: React.FC = () => {
    const { player, setPlayer, setTelegramId } = usePlayer();
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [isNewPlayer, setIsNewPlayer] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false); // Новое состояние

    useEffect(() => {
        const loadPlayerData = async () => {
            try {
                if (!window.Telegram?.WebApp) {
                    throw new Error('Telegram WebApp не доступен');
                }

                const telegramUserId = window.Telegram.WebApp.initDataUnsafe.user?.id || null;
                if (!telegramUserId) {
                    throw new Error('Пользователь не авторизован');
                }
                setTelegramId(telegramUserId);

                await new Promise(resolve => setTimeout(resolve, 4000));

                const playerData = await PlayerService.getByTelegramId(telegramUserId);
                setIsLoading(false);

                if (!playerData) {
                    setIsNewPlayer(true);
                    return;
                }

                setPlayer(playerData);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
                setErrorText(errorMessage);
                setIsLoading(false);
            }
        };

        loadPlayerData();
    }, []);

    // Обработчик успешной регистрации
    const handleRegistrationSuccess = () => {
        setRegistrationComplete(true);
    };

    // Если регистрация завершена, показываем MainScreen
    if (registrationComplete) {
        return <MainScreen />;
    }

    if (isLoading) return <LoadingScreen/>;
    if (isNewPlayer) return <RegistrationScreen onRegistrationSuccess={handleRegistrationSuccess} />;
    if (errorText) return <ErrorScreen message={errorText}/>;

    return <MainScreen/>;
};

export default App;