export class TelegramService {
    static init() {
        if (typeof window.Telegram?.WebApp?.ready === 'function') {
            window.Telegram.WebApp.ready();
            this.expand();
        }
    }

    static getUser() {
        return window.Telegram?.WebApp?.initDataUnsafe?.user;
    }

    static getUserId(): number | null {
        return this.getUser()?.id || null;
    }

    static expand() {
        if (typeof window.Telegram?.WebApp?.expand === 'function') {
            window.Telegram.WebApp.expand();
        }
    }
}