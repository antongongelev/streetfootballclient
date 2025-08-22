// components/PopupContainer.tsx
import React from 'react';
import Popup from './Popup';
import { usePopup } from '../contexts/PopupContext';

export const PopupContainer: React.FC = () => {
    const { popups, hidePopup } = usePopup();

    // Группируем popup'ы по позиции
    const topPopups = popups.filter(p => p.position === 'top');
    const centerPopups = popups.filter(p => p.position === 'center');
    const bottomPopups = popups.filter(p => p.position === 'bottom');

    return (
        <>
            {/* Top popups */}
            <div className="popup-container top">
                {topPopups.map(popup => (
                    <Popup
                        key={popup.id}
                        {...popup}
                        onClose={() => hidePopup(popup.id)}
                    />
                ))}
            </div>

            {/* Center popups */}
            <div className="popup-container center">
                {centerPopups.map(popup => (
                    <Popup
                        key={popup.id}
                        {...popup}
                        onClose={() => hidePopup(popup.id)}
                    />
                ))}
            </div>

            {/* Bottom popups */}
            <div className="popup-container bottom">
                {bottomPopups.map(popup => (
                    <Popup
                        key={popup.id}
                        {...popup}
                        onClose={() => hidePopup(popup.id)}
                    />
                ))}
            </div>
        </>
    );
};