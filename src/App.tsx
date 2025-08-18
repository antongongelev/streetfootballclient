import React, {useEffect, useState} from 'react';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import MainScreen from './components/MainScreen';
import {PlayerService} from "./api/playerService";
import RegistrationScreen from "./components/RegistrationScreen";
import {usePlayer} from "./contexts/PlayerContext";

const App: React.FC = () => {
    const { player, setPlayer } = usePlayer(); // Доступ к глобальному стейту
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [isNewPlayer, setIsNewPlayer] = useState(false);

    useEffect(() => {
        const loadPlayerData = async () => {
            try {
                // // 1. Сначала проверяем доступность Telegram WebApp
                // if (!window.Telegram?.WebApp) {
                //     throw new Error('Telegram WebApp не доступен');
                // }
                //
                // // 2. Получаем ID пользователя
                // const telegramUserId = window.Telegram.WebApp.initDataUnsafe.user?.id || null;
                // if (!telegramUserId) {
                //     throw new Error('Пользователь не авторизован');
                // }

                // 3. Делаем запрос к API
                const playerData = await PlayerService.getByTelegramId(132);
                setIsLoading(false);

                if (!playerData) {
                    setIsNewPlayer(true)
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

    if (isLoading) return <LoadingScreen/>;
    if (isNewPlayer) return <RegistrationScreen/>;
    if (errorText) return <ErrorScreen message={errorText}/>;

    return <MainScreen/>;
};

export default App;