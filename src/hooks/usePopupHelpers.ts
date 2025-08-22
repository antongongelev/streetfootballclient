// hooks/usePopupHelpers.ts
import { usePopup } from '../contexts/PopupContext';

export const usePopupHelpers = () => {
    const { showPopup } = usePopup();

    const success = (message: string, duration: number = 3000, position: 'top' | 'center' | 'bottom' = 'bottom') => {
        showPopup('success', message, duration, position);
    };

    const warn = (message: string, duration: number = 3000, position: 'top' | 'center' | 'bottom' = 'bottom') => {
        showPopup('warn', message, duration, position);
    };

    const error = (message: string, duration: number = 3000, position: 'top' | 'center' | 'bottom' = 'bottom') => {
        showPopup('error', message, duration, position);
    };

    const info = (message: string, duration: number = 3000, position: 'top' | 'center' | 'bottom' = 'bottom') => {
        showPopup('info', message, duration, position);
    };

    return { success, warn, error, info };
};