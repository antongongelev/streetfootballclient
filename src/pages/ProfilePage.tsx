import React from 'react';
import '../styles/global.css';
import {usePlayer} from "../contexts/PlayerContext";

const ProfilePage: React.FC = () => {

    const { player } = usePlayer();

    return (
        <div className="page">
            <h1>Профиль</h1>
            {player && (
                <div>
                    <p>Telegram ID: {player.telegramId}</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;