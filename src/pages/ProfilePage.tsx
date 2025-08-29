// pages/ProfilePage.tsx
import React, {useEffect, useState} from 'react';
import {useApplicationContext} from "../contexts/ApplicationContext";
import {PlayerService} from "../api/playerService";
import DatePicker from "../components/DatePicker";
import LoadingSpinner from "../components/LoadingSpinner";
import {PositionCode, POSITIONS} from "../api/types";
import PersonIcon from '../assets/icons/person.png';
import EditIcon from '../assets/icons/edit.png';
import CancelIcon from '../assets/icons/cancel.png'; // Добавляем иконку отмены
import {usePopupHelpers} from '../hooks/usePopupHelpers';
import "../styles/registration.css";

const POSITION_CODES = Object.keys(POSITIONS) as PositionCode[];

const ProfilePage: React.FC = () => {
    const {success, warn, error} = usePopupHelpers();
    const {telegramUser, player, setPlayer} = useApplicationContext();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        nickname: '',
        male: true,
        birthDate: '',
        primaryPosition: '',
        secondaryPosition: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [avatarPreview, setAvatarPreview] = useState<string>(PersonIcon);

    // Заполняем данные из контекста при загрузке
    useEffect(() => {
        if (!player) {
            error("Не удалось найти профиль")
            return;
        }
        setFormData({
            nickname: player.nickname,
            male: player.male,
            birthDate: player.birthDate,
            primaryPosition: player.primaryPosition,
            secondaryPosition: player.secondaryPosition || '',
        });

        if (telegramUser.photo_url) {
            setAvatarPreview(telegramUser.photo_url);
        }
    }, [player]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nickname.trim()) {
            newErrors.nickname = 'Введите никнейм';
        } else if (formData.nickname.length > 30) {
            newErrors.nickname = 'Максимум 30 символов';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Укажите дату рождения';
        }

        if (!formData.primaryPosition) {
            newErrors.primaryPosition = 'Выберите основную роль';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getDefaultMaxDate = (): string => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 10);
        return date.toISOString().split('T')[0];
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Восстанавливаем исходные данные
        if (player) {
            setFormData({
                nickname: player.nickname,
                male: player.male,
                birthDate: player.birthDate,
                primaryPosition: player.primaryPosition,
                secondaryPosition: player.secondaryPosition || '',
            });
        }
        setIsEditing(false);
        setErrors({});
    };

    const handleSave = async () => {
        if (!validateForm()) {
            warn('Пожалуйста, проверьте данные');
            return;
        }

        if (!player) {
            error('Ошибка: данные игрока не найдены');
            return;
        }

        setIsSaving(true);
        try {
            const updatedPlayer = await PlayerService.update(player.telegramId, {
                nickname: formData.nickname,
                male: formData.male,
                birthDate: formData.birthDate,
                primaryPosition: formData.primaryPosition,
                secondaryPosition: formData.secondaryPosition || null,
            });

            setPlayer(updatedPlayer);
            setIsEditing(false);
            success('Данные успешно обновлены!');

        } catch (err) {
            console.error('Update failed:', err);
            error('Ошибка при обновлении данных');
        } finally {
            setIsSaving(false);
        }
    };

    if (!player) {
        return (
            <div className="page">
                <div className="loading-container">
                    <LoadingSpinner/>
                    <p>Загрузка данных профиля...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-container profile-page-container">
            <div className="registration-container"> {/* Используем тот же контейнер */}

                <button
                    className="edit-button-corner"
                    onClick={isEditing ? handleCancel : handleEdit}
                    disabled={isLoading || isSaving}
                    title={isEditing ? "Отменить редактирование" : "Редактировать профиль"}
                >
                    <img
                        src={isEditing ? CancelIcon : EditIcon}
                        alt={isEditing ? "Отменить" : "Редактировать"}
                        className="edit-icon"
                    />
                </button>

                <form className="registration-form">
                    {/* Секция аватара */}
                    <div className="avatar-section">
                        <div className="avatar-preview-container">
                            <div className="avatar-preview">
                                <img
                                    src={avatarPreview}
                                    alt="Аватар"
                                    className="avatar-image"
                                    onError={() => setAvatarPreview(PersonIcon)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Поле никнейма */}
                    <div className="form-group nickname-group">
                        <label className="form-label">Никнейм:</label>
                        <div className="nickname-input-container">
                            <input
                                type="text"
                                placeholder="Введите ваш никнейм"
                                value={formData.nickname}
                                onChange={(e) => setFormData(prev => ({...prev, nickname: e.target.value}))}
                                className="tg-input nickname-input"
                                maxLength={30}
                                disabled={!isEditing || isLoading}
                            />
                        </div>
                        {errors.nickname && (
                            <div className="error-text">{errors.nickname}</div>
                        )}
                    </div>

                    {/* Выбор пола */}
                    <div className="form-group">
                        <label className="form-label">Пол:</label>
                        <div className="gender-switch">
                            <button
                                type="button"
                                className={`gender-option ${formData.male ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({...prev, male: true}))}
                                disabled={!isEditing || isLoading}
                            >
                                Мужской
                            </button>
                            <button
                                type="button"
                                className={`gender-option ${!formData.male ? 'active' : ''}`}
                                onClick={() => setFormData(prev => ({...prev, male: false}))}
                                disabled={!isEditing || isLoading}
                            >
                                Женский
                            </button>
                        </div>
                    </div>

                    {/* Дата рождения */}
                    <div className="form-group date-group">
                        <label className="form-label">Дата рождения:</label>
                        <DatePicker
                            value={formData.birthDate}
                            onChange={(date) => setFormData(prev => ({...prev, birthDate: date}))}
                            disabled={!isEditing || isLoading}
                            minDate="1960-01-01"
                            maxDate={getDefaultMaxDate()}
                            defaultDate="2000-01-01"
                        />
                        {errors.birthDate && (
                            <div className="error-text date-error">{errors.birthDate}</div>
                        )}
                    </div>

                    {/* Основная роль */}
                    <div className="form-group">
                        <label className="form-label">Основная роль:</label>
                        <select
                            value={formData.primaryPosition}
                            onChange={(e) => setFormData(prev => ({...prev, primaryPosition: e.target.value}))}
                            className="tg-input"
                            disabled={!isEditing || isLoading}
                        >
                            <option value="">Выберите роль</option>
                            {POSITION_CODES.map(code => (
                                <option key={code} value={code}>
                                    {POSITIONS[code]}
                                </option>
                            ))}
                        </select>
                        {errors.primaryPosition && (
                            <div className="error-text">{errors.primaryPosition}</div>
                        )}
                    </div>

                    {/* Дополнительная роль */}
                    <div className="form-group">
                        <label className="form-label">Дополнительная роль (необязательно):</label>
                        <select
                            value={formData.secondaryPosition}
                            onChange={(e) => setFormData(prev => ({...prev, secondaryPosition: e.target.value}))}
                            className="tg-input"
                            disabled={!isEditing || isLoading}
                        >
                            <option value="">Не выбрано</option>
                            {POSITION_CODES.map(code => (
                                <option key={code} value={code}>
                                    {POSITIONS[code]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Кнопка сохранения внизу формы */}
                    {isEditing && (
                        <div className="form-action-buttons">
                            <button
                                type="button"
                                className="save-button"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? <LoadingSpinner size={16}/> : 'Сохранить'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;