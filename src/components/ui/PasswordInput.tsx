import React, {useState} from 'react';
import {Input, InputProps} from './Input';
import {Button} from './Button';
import '../../styles/global.css';

interface PasswordInputProps extends Omit<InputProps, 'type'> {
    showStrength?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
                                                                showStrength = false,
                                                                ...inputProps
                                                            }) => {
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password: string): { strength: number; label: string } => {
        if (password.length === 0) return {strength: 0, label: ''};
        if (password.length < 6) return {strength: 1, label: 'Weak'};
        if (password.length < 8) return {strength: 2, label: 'Medium'};
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return {strength: 3, label: 'Good'};
        return {strength: 4, label: 'Strong'};
    };

    const passwordStrength = showStrength ? getPasswordStrength(inputProps.value) : null;

    return (
        <div className="password-input-container">
            <div className="password-input-wrapper">
                <Input
                    {...inputProps}
                    type={showPassword ? 'text' : 'password'}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? 'Hide' : 'Show'}
                </Button>
            </div>

            {showStrength && passwordStrength && inputProps.value && (
                <div className="password-strength">
                    <div className="password-strength-bars">
                        {[1, 2, 3, 4].map((level) => (
                            <div
                                key={level}
                                className={`password-strength-bar ${
                                    level <= passwordStrength.strength ? 'active' : ''
                                } strength-${passwordStrength.strength}`}
                            />
                        ))}
                    </div>
                    <span className="password-strength-label">
            {passwordStrength.label}
          </span>
                </div>
            )}
        </div>
    );
};