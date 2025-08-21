// DatePicker.tsx
import React, { useRef } from 'react';
import '../styles/dateppicker.css';

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    minDate?: string;
    maxDate?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   value,
                                                   onChange,
                                                   minDate = '1980-01-01',
                                                   maxDate = new Date().toISOString().split('T')[0]
                                               }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        inputRef.current?.showPicker();
    };

    const isFirefox = typeof window !== 'undefined' &&
        navigator.userAgent.toLowerCase().includes('firefox');

    return (
        <div className="date-picker-container" onClick={handleContainerClick}>
            <input
                ref={inputRef}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                min={minDate}
                max={maxDate}
                className="date-input"
                style={isFirefox ? {
                    backgroundImage: 'none',
                    paddingRight: '12px'
                } : {}}
            />
            {/* Добавляем кастомную иконку календаря */}
            <div className="calendar-icon">📅</div>
        </div>
    );
};

export default DatePicker;