import React from 'react';
import { LoadingOverlay } from './ui/LoadingOverlay';
import '../styles/global.css';

const LoadingScreen: React.FC = () => {
    return (
        <div className="screen-container">
            <LoadingOverlay message="Загрузка..." show={true} />
        </div>
    );
};

export default LoadingScreen;