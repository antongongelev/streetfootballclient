import React from 'react';
import '../../styles/global.css';

interface LoadingOverlayProps {
    message?: string;
    show?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
                                                                  message = 'Загрузка...',
                                                                  show = true,
                                                              }) => {
    if (!show) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-animation">
                <div className="spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
};