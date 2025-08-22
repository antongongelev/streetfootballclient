// hooks/useTelegramTheme.ts
import { useEffect, useState, useCallback } from 'react';

export interface TelegramTheme {
    isDark: boolean;
    colors: {
        bg_color: string;
        text_color: string;
        hint_color: string;
        link_color: string;
        button_color: string;
        button_text_color: string;
    };
}

export const useTelegramTheme = () => {
    const [theme, setTheme] = useState<TelegramTheme>({
        isDark: false,
        colors: {
            bg_color: '#ffffff',
            text_color: '#000000',
            hint_color: '#999999',
            link_color: '#2481cc',
            button_color: '#40a7e3',
            button_text_color: '#ffffff'
        }
    });

    // Функция для переключения темы
    const toggleTheme = useCallback(() => {
        const newIsDark = !theme.isDark;
        const newTheme = {
            isDark: newIsDark,
            colors: {
                bg_color: newIsDark ? '#212121' : '#ffffff',
                text_color: newIsDark ? '#ffffff' : '#000000',
                hint_color: '#999999',
                link_color: '#2481cc',
                button_color: '#40a7e3',
                button_text_color: '#ffffff'
            }
        };

        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newIsDark ? 'dark' : 'light');

        // Сохраняем в localStorage для сохранения выбора
        localStorage.setItem('theme-preference', newIsDark ? 'dark' : 'light');
    }, [theme.isDark]);

    // Функция для установки конкретной темы
    const setThemeMode = useCallback((isDark: boolean) => {
        const newTheme = {
            isDark,
            colors: {
                bg_color: isDark ? '#212121' : '#ffffff',
                text_color: isDark ? '#ffffff' : '#000000',
                hint_color: '#999999',
                link_color: '#2481cc',
                button_color: '#40a7e3',
                button_text_color: '#ffffff'
            }
        };

        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        const initTheme = () => {
            // 1. Проверяем сохраненную тему в localStorage
            const savedTheme = localStorage.getItem('theme-preference');

            // 2. Если есть сохраненная тема - используем её
            if (savedTheme) {
                const isDark = savedTheme === 'dark';
                setThemeMode(isDark);
                return;
            }

            // 3. Проверяем Telegram WebApp
            if (window.Telegram?.WebApp) {
                const isDark = window.Telegram.WebApp.colorScheme === 'dark';
                const themeParams = window.Telegram.WebApp.themeParams || {};

                setTheme({
                    isDark,
                    colors: {
                        bg_color: themeParams.bg_color || (isDark ? '#212121' : '#ffffff'),
                        text_color: themeParams.text_color || (isDark ? '#ffffff' : '#000000'),
                        hint_color: themeParams.hint_color || '#999999',
                        link_color: themeParams.link_color || '#2481cc',
                        button_color: themeParams.button_color || '#40a7e3',
                        button_text_color: themeParams.button_text_color || '#ffffff'
                    }
                });

                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            }
            // 4. Fallback для браузера
            else if (window.matchMedia) {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setThemeMode(isDark);
            }
        };

        initTheme();

        // Слушаем изменения темы в Telegram
        if (window.Telegram?.WebApp?.onEvent) {
            window.Telegram.WebApp.onEvent('themeChanged', initTheme);
        }

        // Слушаем изменения системной темы в браузере
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', initTheme);

        return () => {
            if (window.Telegram?.WebApp?.offEvent) {
                window.Telegram.WebApp.offEvent('themeChanged', initTheme);
            }
            mediaQuery.removeEventListener('change', initTheme);
        };
    }, [setThemeMode]);

    return {
        theme,
        toggleTheme,
        setThemeMode,
        isDark: theme.isDark
    };
};