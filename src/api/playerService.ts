import {ApiClient} from './client';
import {Player, PlayerModifiableData} from './types';

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

    register: async (telegramId: number, data: PlayerModifiableData): Promise<Player> => {
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

    update: async (telegramId: number, data: PlayerModifiableData): Promise<Player> => {
        try {
            const {data: player} = await ApiClient.post<Player>(`/players/update`, {
                telegramId,
                ...data
            });
            return player;
        } catch (error) {
            console.error('Update failed:', error);
            throw error;
        }
    },

};