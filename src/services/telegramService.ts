// services/telegramService.ts
export interface TelegramUser {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

export class TelegramService {
    static init() {
        if (typeof window.Telegram?.WebApp?.ready === 'function') {
            window.Telegram.WebApp.ready();
        }
    }

    static async getUser(): Promise<TelegramUser | null> {
        // Добавляем задержку в 3 секунды
        await new Promise(resolve => setTimeout(resolve, 3000));
        return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
    }
}