// components/Popup.tsx
import React, { useEffect, useState } from 'react';
import { PopupItem } from '../contexts/PopupContext';

// Импортируем иконки
import successIcon from '../assets/icons/success.png';
import warnIcon from '../assets/icons/warn.png';
import errorIcon from '../assets/icons/error.png';
import infoIcon from '../assets/icons/info.png';

interface PopupProps extends PopupItem {
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({
                                         type,
                                         message,
                                         visible,
                                         autoclosable,
                                         onClose
                                     }) => {
    const [isVisible, setIsVisible] = useState(visible);

    useEffect(() => {
        setIsVisible(visible);
    }, [visible]);

    const getIcon = () => {
        switch (type) {
            case 'success': return successIcon;
            case 'warn': return warnIcon;
            case 'error': return errorIcon;
            default: return infoIcon;
        }
    };

    const getClassName = () => {
        return `popup popup-${type} ${isVisible ? 'popup-visible' : 'popup-hidden'}`;
    };

    return (
        <div className={getClassName()}>
            <div className="popup-content">
                <div className="popup-icon-container">
                    <img
                        src={getIcon()}
                        alt={type}
                        className="popup-icon-image"
                        width={18}
                        height={18}
                    />
                </div>
                <span className="popup-message">{message}</span>
                {!autoclosable && (
                    <button className="popup-close" onClick={onClose}>×</button>
                )}
            </div>
        </div>
    );
};

export default Popup;