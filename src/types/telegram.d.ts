// Отключаем автоматические типы из @twa-dev/sdk
declare module '@twa-dev/sdk' {
    export interface WebApp {
        initData: string;
        initDataUnsafe: {
            user?: TelegramUser;
            query_id?: string;
        };
        ready(): void;
        expand(): void;
        // Добавьте другие методы по мере необходимости
    }

    export const WebApp: WebApp;
}

// Глобальное объявление для window.Telegram
declare global {
    interface Window {
        Telegram?: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user?: TelegramUser;
                };
                ready(): void;
                expand(): void;
            };
        };
    }
}

// Основной интерфейс пользователя
export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    is_premium?: boolean;
    photo_url?: string;
    allows_write_to_pm?: boolean;
}