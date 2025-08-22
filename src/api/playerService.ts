import {ApiClient} from './client';
import {Player, RegistrationData} from './types';

export const PlayerService = {
    getByTelegramId: async (telegramId: number): Promise<Player | null> => {
        try {
            const {data} = await ApiClient.get<Player>(`/players/${telegramId}`);
            return data;
        } catch (error) {
            if ((error as { status?: number }).status === 404) {
                return null;
            }
            throw error;
        }
    },

    register: async (telegramId: number, data: RegistrationData): Promise<Player> => {
        try {
            const {data: player} = await ApiClient.post<Player>('/players/create', {
                telegramId,
                ...data
            });
            return player;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    uploadAvatar: async (telegramId: number, avatarFile: File): Promise<void> => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        // Отладочная информация
        console.log('FormData content:');
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            // Используем специальный метод для загрузки файлов
            await ApiClient.uploadFile<void>(`/players/avatar/${telegramId}`, formData);
        } catch (error) {
            console.error('Avatar upload failed:', error);
            throw new Error('Failed to upload avatar');
        }
    },

};