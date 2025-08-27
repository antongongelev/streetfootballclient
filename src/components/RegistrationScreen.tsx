// components/RegistrationScreen.tsx
import React, {useEffect, useState} from "react";
import {useApplicationContext} from "../contexts/ApplicationContext";
import {PlayerService} from "../api/playerService";
import DatePicker from "./DatePicker";
import LoadingSpinner from "./LoadingSpinner";
import "../styles/registration.css";
import {usePopupHelpers} from '../hooks/usePopupHelpers';
import {PositionCode, POSITIONS} from "../api/types";
import PersonIcon from '../assets/icons/person.png';

interface RegistrationScreenProps {
    onRegistrationSuccess: () => void;
}

const POSITION_CODES = Object.keys(POSITIONS) as PositionCode[];

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({onRegistrationSuccess}) => {
    const {success, warn, error} = usePopupHelpers();
    const {telegramUser, setPlayer} = useApplicationContext();

    const [formData, setFormData] = useState({
        nickname: '',
        male: true,
        birthDate: '',
        primaryPosition: '',
        secondaryPosition: '',
    });

    const [avatarPreview, setAvatarPreview] = useState<string>(PersonIcon);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Заполняем данные из Telegram
    useEffect(() => {
        if (!telegramUser) {
            error("Не найдет Telegram-пользователь")
            return;
        }

        const telegramNickname = telegramUser.username ||
            telegramUser.first_name ||
            (telegramUser.first_name && telegramUser.last_name
                ? `${telegramUser.first_name} ${telegramUser.last_name}`
                : telegramUser.last_name || '');

        if (telegramNickname) {
            setFormData(prev => ({...prev, nickname: telegramNickname}));
        }

        if (telegramUser.photo_url) {
            setAvatarPreview(telegramUser.photo_url);
        }
    }, [telegramUser]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            warn('Пожалуйста, проверьте данные');
            return;
        }

        if (!telegramUser) {
            error('Ошибка: данные пользователя не найдены');
            return;
        }

        setIsLoading(true);
        try {
            // Регистрируем пользователя
            const playerData = await PlayerService.register(telegramUser.id, {
                nickname: formData.nickname,
                male: formData.male,
                birthDate: formData.birthDate,
                primaryPosition: formData.primaryPosition,
                secondaryPosition: formData.secondaryPosition || null,
            });

            // Обновляем контекст с новыми данными игрока
            setPlayer(playerData);

            success('Регистрация прошла успешно!');
            onRegistrationSuccess();

        } catch (err) {
            console.error('Registration failed:', err);
            error('Ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-header">
                <h3>Укажите данные профиля</h3>
            </div>

            <form onSubmit={handleSubmit} className="registration-form">
                {/* Секция аватара */}
                <div className="avatar-section">
                    <div className="avatar-preview-container">
                        <div className="avatar-preview" title="Аватар из Telegram">
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
                            disabled={isLoading}
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
                            disabled={isLoading}
                        >
                            Мужской
                        </button>
                        <button
                            type="button"
                            className={`gender-option ${!formData.male ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, male: false}))}
                            disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    >
                        <option value="">Не выбрано</option>
                        {POSITION_CODES.map(code => (
                            <option key={code} value={code}>
                                {POSITIONS[code]}
                            </option>
                        ))}
                    </select>
                </div>


                <button
                    type="submit"
                    className="tg-button submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? <LoadingSpinner/> : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationScreen;