// components/RegistrationScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import { usePlayer } from "../contexts/PlayerContext";
import { PlayerService } from "../api/playerService";
import DatePicker from "./DatePicker";
import LoadingSpinner from "./LoadingSpinner";
import AvatarEditorModal from "./AvatarEditorModal";
import "../styles/registration.css";
import { usePopupHelpers } from '../hooks/usePopupHelpers';
import { TelegramService } from "../services/telegramService";
import CancelIcon from '../assets/icons/cancel.png';
import {PositionCode, POSITIONS} from "../api/types";

interface RegistrationScreenProps {
    onRegistrationSuccess: () => void;
}

// Используем коды позиций из types.ts
const POSITION_CODES = Object.keys(POSITIONS) as PositionCode[];

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegistrationSuccess }) => {
    const { success, warn, error } = usePopupHelpers();
    const { telegramId, setPlayer } = usePlayer();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        nickname: '',
        male: true,
        birthDate: '',
        primaryPosition: '',
        secondaryPosition: '',
        avatar: null as File | null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [showAvatarEditor, setShowAvatarEditor] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [telegramAvatarUrl, setTelegramAvatarUrl] = useState<string | null>(null);
    const [usingTelegramData, setUsingTelegramData] = useState({
        nickname: false,
        avatar: false
    });

    // Получаем данные из Telegram при загрузке компонента
    useEffect(() => {
        const telegramUser = TelegramService.getUser();
        const avatarUrl = TelegramService.getAvatarUrl();

        setTelegramAvatarUrl(avatarUrl);

        // Заполняем данные из Telegram, если они есть
        if (telegramUser) {
            const telegramNickname = telegramUser.username ||
                telegramUser.first_name ||
                (telegramUser.first_name && telegramUser.last_name
                    ? `${telegramUser.first_name} ${telegramUser.last_name}`
                    : telegramUser.last_name || '');

            if (telegramNickname) {
                setFormData(prev => ({ ...prev, nickname: telegramNickname }));
                setUsingTelegramData(prev => ({ ...prev, nickname: true }));
            }
        }

        // Аватар из Telegram
        if (avatarUrl) {
            setAvatarPreview(avatarUrl);
            setUsingTelegramData(prev => ({ ...prev, avatar: true }));
        }
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({avatar: 'Пожалуйста, выберите изображение'});
                return;
            }

            if (file.size > 1024 * 1024) {
                setErrors({avatar: 'Размер файла не должен превышать 1 MB'});
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setOriginalImage(imageUrl);
                setShowAvatarEditor(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCroppedImage = (blob: Blob) => {
        const fileName = `avatar-${telegramId}.jpg`;
        const file = new File([blob], fileName, {type: 'image/jpeg'});
        setFormData(prev => ({...prev, avatar: file}));
        setUsingTelegramData(prev => ({ ...prev, avatar: false }));

        const reader = new FileReader();
        reader.onload = (e) => {
            setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(blob);

        setShowAvatarEditor(false);
        setOriginalImage(null);
    };

    const handleCancelCrop = () => {
        setShowAvatarEditor(false);
        setOriginalImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAvatar = () => {
        setFormData(prev => ({...prev, avatar: null}));
        setUsingTelegramData(prev => ({ ...prev, avatar: true }));
        setAvatarPreview(telegramAvatarUrl);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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

        if (Object.keys(newErrors).length > 0) {
            warn('Пожалуйста, проверьте данные');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            // Регистрируем пользователя
            const playerData = await PlayerService.register(telegramId!, {
                nickname: formData.nickname,
                male: formData.male,
                birthDate: formData.birthDate,
                primaryPosition: formData.primaryPosition,
                secondaryPosition: formData.secondaryPosition || null,
            });

            // Обновляем контекст с новыми данными игрока
            setPlayer(playerData);

            // Загружаем аватар если был выбран новый
            if (formData.avatar) {
                try {
                    await PlayerService.uploadAvatar(telegramId!, formData.avatar);
                    // Обновляем аватар в контексте
                    setPlayer({ ...playerData, avatar: URL.createObjectURL(formData.avatar) });
                } catch (uploadError) {
                    console.error('Avatar upload failed:', uploadError);
                    error('Не удалось сохранить аватар');
                }
            }

            success('Регистрация прошла успешно!');
            onRegistrationSuccess();

        } catch (err) {
            console.error('Registration failed:', err);
            setErrors({ submit: 'Ошибка регистрации. Попробуйте снова.' });
            error('Ошибка при регистрации');
        } finally {
            setIsLoading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="registration-container">
            {showAvatarEditor && originalImage && (
                <AvatarEditorModal
                    imageSrc={originalImage}
                    onSave={handleCroppedImage}
                    onCancel={handleCancelCrop}
                />
            )}

            <div className="registration-header">
                <h3>Укажите данные профиля</h3>
            </div>

            <form onSubmit={handleSubmit} className="registration-form">
                {/* Секция аватара */}
                <div className="avatar-section">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                        id="avatar-upload"
                    />

                    <div className="avatar-preview-container">
                        <div
                            className="avatar-preview"
                            onClick={triggerFileInput}
                            title="Нажмите чтобы изменить аватар"
                        >
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Аватар"
                                    className="avatar-image"
                                    onError={() => setAvatarPreview(null)}
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    <span className="avatar-icon">📸</span>
                                    <span className="avatar-text">Добавить фото</span>
                                </div>
                            )}
                        </div>

                        {formData.avatar && (
                            <button
                                type="button"
                                className="remove-avatar-btn"
                                onClick={removeAvatar}
                                title="Вернуть аватар Telegram"
                            >
                                <img src={CancelIcon} alt="Удалить" className="remove-avatar-icon" />
                            </button>
                        )}
                    </div>

                    {errors.avatar && (
                        <div className="error-text">{errors.avatar}</div>
                    )}
                </div>

                {/* Поле никнейма */}
                <div className="form-group nickname-group">
                    <label className="form-label">Никнейм:</label>
                    <div className="nickname-input-container">
                        <input
                            type="text"
                            placeholder="Введите ваш никнейм"
                            value={formData.nickname}
                            onChange={(e) => {
                                setFormData(prev => ({...prev, nickname: e.target.value}));
                                setUsingTelegramData(prev => ({ ...prev, nickname: false }));
                            }}
                            className="tg-input nickname-input"
                            maxLength={30}
                            disabled={isLoading}
                        />
                    </div>

                    {errors.nickname && (
                        <div className="error-text">{errors.nickname}</div>
                    )}

                    {/*{usingTelegramData.nickname && (*/}
                    {/*    <div className="nickname-hint">*/}
                    {/*        Из вашего аккаунта Telegram*/}
                    {/*    </div>*/}
                    {/*)}*/}
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

                {errors.submit && (
                    <div className="error-text submit-error">{errors.submit}</div>
                )}

                <button
                    type="submit"
                    className="tg-button submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? <LoadingSpinner /> : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
};

export default RegistrationScreen;