import {useEffect, useState} from 'react';
import '../styles/TelegramUserInfo.css';
import {TelegramUser} from "../types/telegram";

export default function TelegramUserInfo() {
    const [user, setUser] = useState<TelegramUser | null>(null);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;

        if (!tg) {
            console.error('Telegram WebApp не обнаружен');
            setStatus('error');
            return;
        }

        tg.ready();
        tg.expand();

        const userData = tg.initDataUnsafe?.user;
        if (userData) {
            setUser({
                ...userData,
                auth_date: tg.initDataUnsafe.auth_date,
            });
            setStatus('ready');
        } else {
            console.error('Данные пользователя не получены');
            setStatus('error');
        }
    }, []);

    if (status === 'loading') {
        return (
            <div className="user-card loading-state">
                <div className="avatar-loader"></div>
                <div className="text-loader">
                    <div className="line-loader"></div>
                    <div className="line-loader short"></div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="user-card error-state">
                <div className="error-icon">⚠️</div>
                <div className="error-message">
                    <h3>Ошибка загрузки</h3>
                    <p>Откройте приложение через Telegram</p>
                </div>
            </div>
        );
    }

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'Неизвестно';
        return new Date(timestamp * 1000).toLocaleString();
    };

    return (
        <div className={`user-card ${isExpanded ? 'expanded' : ''}`}>
            <div className="main-info" onClick={() => setIsExpanded(!isExpanded)}>
                {user?.photo_url ? (
                    <img
                        src={user.photo_url}
                        alt="Аватар"
                        className="avatar"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://i.imgur.com/JNh6V5e.png';
                        }}
                    />
                ) : (
                    <div className="avatar-placeholder">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                )}

                <div className="user-main">
                    <h2>
                        {user?.first_name} {user?.last_name}
                        {user?.is_premium && <span className="premium-badge">★</span>}
                    </h2>
                    {user?.username && <p className="username">@{user.username}</p>}
                </div>

                <div className="expand-icon">
                    {isExpanded ? '▲' : '▼'}
                </div>
            </div>

            {isExpanded && (
                <div className="additional-info">
                    <div className="info-row">
                        <span className="info-label">ID:</span>
                        <span className="info-value">{user?.id}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Язык:</span>
                        <span className="info-value">{user?.language_code?.toUpperCase() || 'Не указан'}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Premium:</span>
                        <span className="info-value">
              {user?.is_premium ? 'Да' : 'Нет'}
            </span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Дата авторизации:</span>
                        <span className="info-value">{formatDate(user?.auth_date)}</span>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Можно писать в ЛС:</span>
                        <span className="info-value">
              {user?.allows_write_to_pm ? '✅' : '❌'}
            </span>
                    </div>
                </div>
            )}
        </div>
    );
}