import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Player} from "../api/types";

interface PlayerContextType {
    player: Player | null;
    setPlayer: (player: Player | null) => void;
    telegramId: number | null;
    setTelegramId: (id: number | null) => void;
}

const ApplicationContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({children}: { children: ReactNode }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [telegramId, setTelegramId] = useState<number | null>(null);

    return (
        <ApplicationContext.Provider value={{player, setPlayer, telegramId, setTelegramId}}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider!');
    }
    return context;
};