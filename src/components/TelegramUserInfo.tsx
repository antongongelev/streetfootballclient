import { useEffect, useState } from 'react';
import '../styles/TelegramUserInfo.css';
import {TelegramUser} from "../types/telegram"; // Ваши существующие стили

export default function TelegramUserInfo() {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    useEffect(() => {
        // 1. Проверяем глобальный объект Telegram
        const tg = window.Telegram?.WebApp;

        if (!tg) {
            console.error('Telegram WebApp не обнаружен');
            setStatus('error');
            return;
        }

        // 2. Инициализируем WebApp
        tg.ready();
        tg.expand();

        // 3. Получаем данные пользователя
        const userData = tg.initDataUnsafe?.user;
        if (userData) {
            setUser(userData);
            setStatus('ready');
        } else {
            console.error('Данные пользователя не получены');
            setStatus('error');
        }
    }, []);

    if (status === 'loading') {
        return <div className="loading">Загрузка данных...</div>;
    }

    if (status === 'error') {
        return (
            <div className="error">
                <p>Не удалось загрузить данные</p>
                <p>Пожалуйста, откройте приложение через Telegram</p>
            </div>
        );
    }

    return (
        <div className="user-card">
            {user?.photo_url && (
                <img
                    src={user.photo_url}
                    alt="Аватар"
                    className="avatar"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                />
            )}
            <div className="user-info">
                <h2>{user?.first_name} {user?.last_name}</h2>
                {user?.username && <p>@{user.username}</p>}
            </div>
        </div>
    );
}