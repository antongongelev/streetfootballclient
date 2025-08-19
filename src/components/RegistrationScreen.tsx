import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import { PlayerService } from '../api/playerService';
import { Card } from './ui/Card';
import { Typography } from './ui/Typography';
import { Input } from './ui/Input';
import { RadioButton } from './ui/RadioButton';
import { DatePicker } from './ui/DatePicker';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Form, FormField } from './ui/Form';
import { LoadingOverlay } from './ui/LoadingOverlay';
import '../styles/global.css';
import {RegistrationData} from "../api/types";

const POSITION_OPTIONS = [
    { value: 'FORWARD', label: 'Forward' },
    { value: 'HALFBACK', label: 'Halfback' },
    { value: 'DEFENDER', label: 'Defender' },
    { value: 'GOALKEEPER', label: 'Goalkeeper' },
];

interface RegistrationScreenProps {
    onRegistrationSuccess: () => void;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegistrationSuccess }) => {
    const { setPlayer, telegramId } = usePlayer();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        nickname: '',
        male: 'true', // Теперь строка для radio
        birthDate: '',
        primaryPosition: '',
        secondaryPosition: '',
    });

    const handleInputChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleRadioChange = (field: string) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nickname.trim()) {
            newErrors.nickname = 'Nickname is required';
        } else if (formData.nickname.length > 20) {
            newErrors.nickname = 'Nickname must be max 20 characters';
        }

        if (!formData.birthDate) {
            newErrors.birthDate = 'Birth date is required';
        } else {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            if (birthDate > today) {
                newErrors.birthDate = 'Birth date cannot be in the future';
            }
        }

        if (!formData.primaryPosition) {
            newErrors.primaryPosition = 'Primary position is required';
        }

        if (formData.secondaryPosition && formData.secondaryPosition === formData.primaryPosition) {
            newErrors.secondaryPosition = 'Secondary position must be different from primary';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!telegramId) {
            setErrors({ submit: 'Telegram ID not available. Please refresh the page.' });
            return;
        }

        setIsLoading(true);

        try {
            const registrationData: RegistrationData = {
                nickname: formData.nickname.trim(),
                male: formData.male === 'true',
                birthDate: formData.birthDate,
                primaryPosition: formData.primaryPosition,
                secondaryPosition: formData.secondaryPosition || null,
            };

            await delay(4000);

            const player = await PlayerService.register(telegramId, registrationData);
            setPlayer(player);

            onRegistrationSuccess();

        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.status === 400) {
                setErrors({ submit: 'Invalid data. Please check your information.' });
            } else if (error.status === 409) {
                setErrors({ submit: 'Player with this Telegram ID already exists.' });
            } else {
                setErrors({ submit: 'Registration failed. Please try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <LoadingOverlay
                show={isLoading}
                message="Creating your profile..."
            />

            <div className="screen-container" style={{ padding: 'var(--spacing-4)' }}>
                <Card padding="lg" className="registration-card">
                    <Typography variant="h3" weight="bold" className="text-center mb-2">
                        Complete Your Profile
                    </Typography>

                    <Typography variant="small" color="muted" className="text-center mb-5">
                        Fill in your details to join the football community
                    </Typography>

                    <Form onSubmit={handleSubmit} className="registration-form">
                        {/* Nickname */}
                        <FormField className="registration-form-field">
                            <Input
                                label="Nickname *"
                                value={formData.nickname}
                                onChange={handleInputChange('nickname')}
                                placeholder="Enter your football nickname"
                                error={errors.nickname}
                                required
                                maxLength={20}
                                disabled={isLoading}
                            />
                            <Typography variant="caption" color="muted">
                                {formData.nickname.length}/20 characters
                            </Typography>
                        </FormField>

                        {/* Gender */}
                        <FormField className="registration-form-field">
                            <Typography variant="small" weight="medium">
                                Gender *
                            </Typography>
                            <div className="radio-group">
                                <RadioButton
                                    name="gender"
                                    value="true"
                                    checked={formData.male === 'true'}
                                    onChange={handleRadioChange('male')}
                                    label="Male"
                                    disabled={isLoading}
                                />
                                <RadioButton
                                    name="gender"
                                    value="false"
                                    checked={formData.male === 'false'}
                                    onChange={handleRadioChange('male')}
                                    label="Female"
                                    disabled={isLoading}
                                />
                            </div>
                        </FormField>

                        {/* Birth Date */}
                        <FormField className="registration-form-field">
                            <DatePicker
                                label="Birth Date *"
                                value={formData.birthDate}
                                onChange={handleInputChange('birthDate')}
                                placeholder="Select your birth date"
                                error={errors.birthDate}
                                disabled={isLoading}
                            />
                        </FormField>

                        {/* Positions Row */}
                        <div className="positions-row">
                            {/* Primary Position */}
                            <FormField className="registration-form-field">
                                <Select
                                    label="Primary Position *"
                                    value={formData.primaryPosition}
                                    onChange={handleInputChange('primaryPosition')}
                                    options={POSITION_OPTIONS}
                                    placeholder="Select position"
                                    error={errors.primaryPosition}
                                    required
                                    disabled={isLoading}
                                />
                            </FormField>

                            {/* Secondary Position */}
                            <FormField className="registration-form-field">
                                <Select
                                    label="Secondary Position"
                                    value={formData.secondaryPosition}
                                    onChange={handleInputChange('secondaryPosition')}
                                    options={POSITION_OPTIONS.filter(opt => opt.value !== formData.primaryPosition)}
                                    placeholder="Optional"
                                    error={errors.secondaryPosition}
                                    disabled={!formData.primaryPosition || isLoading}
                                />
                            </FormField>
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <Typography variant="small" color="error" className="text-center">
                                {errors.submit}
                            </Typography>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Profile...' : 'Complete Registration'}
                        </Button>
                    </Form>

                    <Typography variant="caption" color="muted" className="text-center mt-6">
                        By registering, you agree to our Terms of Service and Privacy Policy
                    </Typography>
                </Card>
            </div>
        </>
    );
};

export default RegistrationScreen;