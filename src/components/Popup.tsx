// components/Popup.tsx
import React, { useEffect, useState } from 'react';
import { PopupItem } from '../contexts/PopupContext';

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
            case 'success': return '✅';
            case 'warn': return '⚠️';
            case 'error': return '❌';
            default: return '💡';
        }
    };

    const getClassName = () => {
        return `popup popup-${type} ${isVisible ? 'popup-visible' : 'popup-hidden'}`;
    };

    return (
        <div className={getClassName()}>
            <div className="popup-content">
                <span className="popup-icon">{getIcon()}</span>
                <span className="popup-message">{message}</span>
                {!autoclosable && (
                    <button className="popup-close" onClick={onClose}>×</button>
                )}
            </div>
        </div>
    );
};

export default Popup;