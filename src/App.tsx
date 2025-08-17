import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import MainScreen from './components/MainScreen';
import { fetchUser } from './api/mockApi';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorText, setErrorText] = useState<string | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // 1. Сначала проверяем доступность Telegram WebApp
                if (!window.Telegram?.WebApp) {
                    throw new Error('Telegram WebApp не доступен');
                }

                // 2. Получаем ID пользователя
                const telegramUserId = window.Telegram.WebApp.initDataUnsafe.user?.id || null;
                if (!telegramUserId) {
                    throw new Error('Пользователь не авторизован');
                }

                // 3. Делаем запрос к API
                const response = await fetchUser(telegramUserId);
                if (!response.success) throw new Error('Ошибка загрузки данных');

                setIsLoading(false);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
                setErrorText(errorMessage);
                setIsLoading(false);
            }
        };

        loadUserData();
    }, []);

    if (isLoading) return <LoadingScreen />;
    if (errorText) return <ErrorScreen message={errorText} />;

    return <MainScreen />;
};

export default App;