// components/StartScreen.tsx
import React from 'react';
import '../styles/start-screen.css';
import StartGif from '../assets/icons/start.png';

const StartScreen: React.FC = () => {
    return (
        <div className="start-screen">
            <div className="start-screen-content">
                <img
                    src={StartGif}
                    alt="Street Football"
                    className="start-screen-image"
                />
            </div>
        </div>
    );
};

export default StartScreen;