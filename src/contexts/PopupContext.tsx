// contexts/PopupContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type PopupType = 'success' | 'warn' | 'error' | 'info';
export type PopupPosition = 'top' | 'center' | 'bottom';

export interface PopupItem {
    id: string;
    type: PopupType;
    message: string;
    duration?: number;
    position?: PopupPosition;
    visible: boolean;
    autoclosable: boolean;
}

interface PopupContextType {
    popups: PopupItem[];
    showPopup: (type: PopupType, message: string, duration?: number, position?: PopupPosition) => void;
    hidePopup: (id: string) => void;
    hideAllPopups: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

type PopupAction =
    | { type: 'ADD_POPUP'; payload: PopupItem }
    | { type: 'REMOVE_POPUP'; payload: string }
    | { type: 'HIDE_POPUP'; payload: string }
    | { type: 'CLEAR_ALL' };

function popupReducer(state: PopupItem[], action: PopupAction): PopupItem[] {
    switch (action.type) {
        case 'ADD_POPUP':
            return [...state, action.payload];
        case 'REMOVE_POPUP':
            return state.filter(popup => popup.id !== action.payload);
        case 'HIDE_POPUP':
            return state.map(popup =>
                popup.id === action.payload ? { ...popup, visible: false } : popup
            );
        case 'CLEAR_ALL':
            return [];
        default:
            return state;
    }
}

export const PopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [popups, dispatch] = useReducer(popupReducer, []);

    const showPopup = (
        type: PopupType,
        message: string,
        duration = 3000,
        position: PopupPosition = 'bottom'
    ) => {
        const id = Math.random().toString(36).substr(2, 9);

        const newPopup: PopupItem = {
            id,
            type,
            message,
            duration,
            position,
            visible: true,
            autoclosable: duration > 0
        };

        dispatch({ type: 'ADD_POPUP', payload: newPopup });

        if (duration > 0) {
            setTimeout(() => {
                dispatch({ type: 'HIDE_POPUP', payload: id });

                setTimeout(() => {
                    dispatch({ type: 'REMOVE_POPUP', payload: id });
                }, 300);
            }, duration);
        }
    };

    const hidePopup = (id: string) => {
        dispatch({ type: 'HIDE_POPUP', payload: id });
        setTimeout(() => {
            dispatch({ type: 'REMOVE_POPUP', payload: id });
        }, 300);
    };

    const hideAllPopups = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };

    return (
        <PopupContext.Provider value={{ popups, showPopup, hidePopup, hideAllPopups }}>
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
};