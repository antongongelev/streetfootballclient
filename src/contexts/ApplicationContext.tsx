// contexts/ApplicationContext.tsx
import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import { Player } from "../api/types";
import { TelegramUser } from "../services/telegramService";

interface ApplicationContextType {
    player: Player | null;
    telegramUser: TelegramUser | null;
    setPlayer: (player: Player | null) => void;
    setTelegramUser: (user: TelegramUser | null) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);

    return (
        <ApplicationContext.Provider value={{
            player,
            telegramUser,
            setPlayer,
            setTelegramUser,
        }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplicationContext = (): ApplicationContextType => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider!');
    }
    return context;
};