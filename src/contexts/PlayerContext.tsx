// contexts/PlayerContext.tsx
import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import { Player } from "../api/types";

interface PlayerContextType {
    player: Player | null;
    telegramId: number | null;
    setPlayer: (player: Player | null) => void;
    setTelegramId: (id: number | null) => void;
    clearPlayer: () => void;
    updatePlayer: (updates: Partial<Player>) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [telegramId, setTelegramId] = useState<number | null>(null);

    const clearPlayer = useCallback(() => {
        setPlayer(null);
    }, []);

    const updatePlayer = useCallback((updates: Partial<Player>) => {
        setPlayer(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    return (
        <PlayerContext.Provider value={{
            player,
            telegramId,
            setPlayer,
            setTelegramId,
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