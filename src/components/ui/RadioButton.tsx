import React from 'react';
import '../../styles/global.css';

interface RadioButtonProps {
    name: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
    label: string;
    disabled?: boolean;
    className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
                                                            name,
                                                            value,
                                                            checked,
                                                            onChange,
                                                            label,
                                                            disabled = false,
                                                            className = '',
                                                        }) => {
    const id = React.useId();

    return (
        <div className={`radio-container ${className}`}>
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="radio-input"
            />
            <label htmlFor={id} className="radio-label">
                {label}
            </label>
        </div>
    );
};