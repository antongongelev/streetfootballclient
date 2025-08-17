import React from 'react';
import '../styles/global.css';

const LoadingScreen: React.FC = () => {
    return (
        <div className="screen-container">
            <div className="loading-animation">
                <div className="spinner"></div>
                <p>Загрузка...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;