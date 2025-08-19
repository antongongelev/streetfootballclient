import React from 'react';
import '../../styles/global.css';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    disabled?: boolean;
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
                                                      checked,
                                                      onChange,
                                                      label,
                                                      disabled = false,
                                                      className = '',
                                                  }) => {
    const id = React.useId();

    return (
        <div className={`checkbox-container ${className}`}>
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="checkbox-input"
            />
            <label htmlFor={id} className="checkbox-label">
                {label}
            </label>
        </div>
    );
};