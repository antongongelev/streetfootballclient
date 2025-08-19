import React from 'react';
import '../../styles/global.css';

export interface InputProps {
    type?: 'text' | 'email' | 'password' | 'number' | 'tel';
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
                                                type = 'text',
                                                value,
                                                onChange,
                                                placeholder,
                                                label,
                                                error,
                                                disabled = false,
                                                required = false,
                                                className = '',
                                                size = 'md',
                                            }) => {
    const inputId = React.useId();

    const baseClasses = `input input-${size} ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''} ${className}`;

    return (
        <div className="input-container">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <input
                id={inputId}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={baseClasses}
            />

            {error && (
                <p className="input-error-message">
                    {error}
                </p>
            )}
        </div>
    );
};