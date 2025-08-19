import React, {createContext, ReactNode, useContext, useState} from 'react';
import {Player} from "../api/types";

// Типы для контекста
interface PlayerContextType {
    player: Player | null;
    setPlayer: (player: Player | null) => void;
    telegramId: number | null;
    setTelegramId: (id: number | null) => void;
}

// Создаем контекст с начальным значением `null`
const PlayerContext = createContext<PlayerContextType | null>(null);

// Провайдер для обертки приложения
export const PlayerProvider = ({children}: { children: ReactNode }) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const [telegramId, setTelegramId] = useState<number | null>(null);

    return (
        <PlayerContext.Provider value={{player, setPlayer, telegramId, setTelegramId}}>
            {children}
        </PlayerContext.Provider>
    );
};

// Хук для доступа к контексту
export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider!');
    }
    return context;
};