import React from 'react';
import '../../styles/global.css';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
                                                          value,
                                                          onChange,
                                                          placeholder = 'Select date',
                                                          label,
                                                          error,
                                                          disabled = false,
                                                          className = '',
                                                      }) => {
    const id = React.useId();

    const formatDisplayDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="datepicker-container">
            {label && (
                <label htmlFor={id} className="datepicker-label">
                    {label}
                </label>
            )}

            <div className="datepicker-wrapper">
                <input
                    id={id}
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`datepicker-input ${error ? 'datepicker-error' : ''} ${disabled ? 'datepicker-disabled' : ''} ${className}`}
                />
                <span className="datepicker-display">
          {value ? formatDisplayDate(value) : placeholder}
        </span>
                <span className="datepicker-icon">📅</span>
            </div>

            {error && (
                <p className="datepicker-error-message">
                    {error}
                </p>
            )}
        </div>
    );
};