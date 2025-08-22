// RegistrationScreen.tsx
import React, {useRef, useState} from "react";
import {usePlayer} from "../contexts/PlayerContext";
import {PlayerService} from "../api/playerService";
import DatePicker from "./DatePicker";
import LoadingSpinner from "./LoadingSpinner";
import AvatarEditorModal from "./AvatarEditorModal";
import "../styles/registration.css";
import {usePopupHelpers} from '../hooks/usePopupHelpers';

interface RegistrationScreenProps {
    onRegistrationSuccess: () => void;
}

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({onRegistrationSuccess}) => {
    const {success, warn, error, info} = usePopupHelpers();
    const {telegramId} = usePlayer();
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({avatar: 'Пожалуйста, выберите изображение'});
                return;
            }

            if (file.size > 1024 * 1024) {
                setErrors({avatar: 'Размер файла не должен превышать 5MB'});
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
        let fileName = telegramId + '.jpg';
        const file = new File([blob], fileName, {type: 'image/jpeg'});
        setFormData(prev => ({...prev, avatar: file}));

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
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {

        const newErrors: Record<string, string> = {};
        if (!formData.nickname.trim()) newErrors.nickname = 'Введите никнейм';
        if (formData.nickname.length > 30) newErrors.nickname = 'Максимум 30 символов';
        if (!formData.birthDate) newErrors.birthDate = 'Укажите дату рождения';
        if (!formData.primaryPosition) newErrors.primaryPosition = 'Выберите основную роль';

        setErrors(newErrors);
        let valid = Object.keys(newErrors).length === 0;

        if (!valid) {
            warn('Пожалуйста, проверьте данные')
        }

        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {

            await PlayerService.register(telegramId!, {
                nickname: formData.nickname,
                male: formData.male,
                birthDate: formData.birthDate,
                primaryPosition: formData.primaryPosition,
                secondaryPosition: formData.secondaryPosition || null,
            });

            if (formData.avatar) {
                try {
                    await PlayerService.uploadAvatar(telegramId!, formData.avatar);
                } catch (uploadError) {
                    error('Не удалось сохранить аватар')
                }
            }

            onRegistrationSuccess();
        } catch (error) {
            setErrors({submit: 'Ошибка регистрации. Попробуйте снова.'});
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
                <h2>Регистрация</h2>
            </div>

            <form onSubmit={handleSubmit} className="registration-form">
                {/* Загрузка аватара */}
                <div className="avatar-section">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{display: 'none'}}
                        id="avatar-upload"
                    />

                    <div className="avatar-preview-container">
                        <div className="avatar-preview" onClick={triggerFileInput}>
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Аватар" className="avatar-image"/>
                            ) : (
                                <div className="avatar-placeholder">
                                    <span className="avatar-icon">📸</span>
                                </div>
                            )}
                        </div>
                        {avatarPreview && (
                            <button
                                type="button"
                                className="remove-avatar-btn"
                                onClick={removeAvatar}
                                title="Удалить аватар"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    {errors.avatar && <div className="error-text">{errors.avatar}</div>}
                </div>

                {/* Поле никнейма */}
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Никнейм (макс. 30 символов)"
                        value={formData.nickname}
                        onChange={(e) => setFormData(prev => ({...prev, nickname: e.target.value}))}
                        className="tg-input nickname-input"
                        maxLength={30}
                    />
                    {errors.nickname && <div className="error-text">{errors.nickname}</div>}
                </div>

                {/* Выбор пола */}
                <div className="form-group">
                    <label className="form-label">Пол:</label>
                    <div className="gender-switch">
                        <button
                            type="button"
                            className={`gender-option ${formData.male ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, male: true}))}
                        >
                            Мужской
                        </button>
                        <button
                            type="button"
                            className={`gender-option ${!formData.male ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({...prev, male: false}))}
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
                    >
                        <option value="">Выберите роль</option>
                        {POSITIONS.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>
                    {errors.primaryPosition && <div className="error-text">{errors.primaryPosition}</div>}
                </div>

                {/* Дополнительная роль */}
                <div className="form-group">
                    <label className="form-label">Дополнительная роль (необязательно):</label>
                    <select
                        value={formData.secondaryPosition}
                        onChange={(e) => setFormData(prev => ({...prev, secondaryPosition: e.target.value}))}
                        className="tg-input"
                    >
                        <option value="">Не выбрано</option>
                        {POSITIONS.map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>
                </div>

                {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

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