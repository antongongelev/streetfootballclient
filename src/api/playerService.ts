import {ApiClient} from './client';
import {Player} from './types';

export const PlayerService = {
    getByTelegramId: async (telegramId: number): Promise<Player | null> => {
        try {
            const {data} = await ApiClient.get<Player>(`/players/telegram/${telegramId}`);
            return data;
        } catch (error) {
            if ((error as { status?: number }).status === 404) {
                return null;
            }
            throw error;
        }
    },
};