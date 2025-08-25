// contexts/PlayerContext.tsx
import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import { Player } from "../api/types";
import { TelegramUser } from "../services/telegramService";

interface PlayerContextType {
    player: Player | null;
    telegramUser: TelegramUser | null;
    setPlayer: (player: Player | null) => void;
    setTelegramUser: (user: TelegramUser | null) => void;
    clearPlayer: () => void;
    updatePlayer: (updates: Partial<Player>) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

    const clearPlayer = useCallback(() => {
        setPlayer(null);
    }, []);

    const updatePlayer = useCallback((updates: Partial<Player>) => {
        setPlayer(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    return (
        <PlayerContext.Provider value={{
            player,
            telegramUser,
            setPlayer,
            setTelegramUser,
            clearPlayer,
            updatePlayer
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = (): PlayerContextType => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider!');
    }
    return context;
};