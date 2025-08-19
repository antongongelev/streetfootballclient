import React from 'react';
import '../../styles/global.css';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
                                                  value,
                                                  onChange,
                                                  options,
                                                  placeholder = 'Select an option',
                                                  label,
                                                  error,
                                                  disabled = false,
                                                  className = '',
                                              }) => {
    const id = React.useId();
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="select-container">
            {label && (
                <label htmlFor={id} className="select-label">
                    {label}
                </label>
            )}

            <div className="select-wrapper">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`select ${error ? 'select-error' : ''} ${disabled ? 'select-disabled' : ''} ${className}`}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span className="select-arrow">▼</span>
                <span className="select-value">
          {selectedOption?.label || placeholder}
        </span>
            </div>

            {error && (
                <p className="select-error-message">
                    {error}
                </p>
            )}
        </div>
    );
};