import React from 'react';
import '../styles/global.css';
import { usePlayer } from "../contexts/PlayerContext";
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Avatar } from '../components/ui/Avatar';
import { formatDate, translatePosition, calculateAge } from '../utils/format';

const ProfilePage: React.FC = () => {
    const { player } = usePlayer();

    if (!player) {
        return (
            <div className="page">
                <Typography variant="h2" weight="bold" className="text-center">
                    Профиль не найден
                </Typography>
            </div>
        );
    }

    const age = calculateAge(player.birthDate);
    const registrationDate = formatDate(player.createdAt);
    const birthDateFormatted = formatDate(player.birthDate);

    return (
        <div className="page">
            <Card padding="md" className="profile-card"> {/* Уменьшаем padding с lg на md */}
                {/* Заголовок профиля */}
                <div className="profile-header">
                    <Avatar src={player.avatar} size="lg" /> {/* Уменьшаем размер аватара с xl на lg */}
                    <div>
                        <Typography variant="h3" weight="bold" className="text-center"> {/* h3 вместо h2 */}
                            {player.nickname}
                        </Typography>
                        <Typography variant="small" color="muted" className="text-center"> {/* small вместо body */}
                            Футболист
                        </Typography>
                    </div>
                </div>

                {/* Основная информация - можно сгруппировать */}
                <div className="profile-info-grid">
                    <div className="profile-info-item">
                        <Typography variant="small" className="profile-info-label">
                            TELEGRAM ID
                        </Typography>
                        <Typography variant="body" className="profile-info-value">
                            {player.telegramId}
                        </Typography>
                    </div>

                    <div className="profile-info-item">
                        <Typography variant="small" className="profile-info-label">
                            ВОЗРАСТ
                        </Typography>
                        <Typography variant="body" className="profile-info-value">
                            {age} лет
                        </Typography>
                    </div>

                    <div className="profile-info-item">
                        <Typography variant="small" className="profile-info-label">
                            ДАТА РОЖДЕНИЯ
                        </Typography>
                        <Typography variant="body" className="profile-info-value">
                            {birthDateFormatted}
                        </Typography>
                    </div>

                    <div className="profile-info-item">
                        <Typography variant="small" className="profile-info-label">
                            ДАТА РЕГИСТРАЦИИ
                        </Typography>
                        <Typography variant="body" className="profile-info-value">
                            {registrationDate}
                        </Typography>
                    </div>
                </div>

                {/* ... остальной код ... */}
            </Card>
        </div>
    );
};

export default ProfilePage;