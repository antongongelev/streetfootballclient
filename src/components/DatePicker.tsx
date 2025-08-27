// DatePicker.tsx
import React, { useState, useEffect } from 'react';
import '../styles/dateppicker.css';

// Выносим функцию наружу компонента
function getDefaultMaxDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    return date.toISOString().split('T')[0];
}

// Функция для получения количества дней в месяце
function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
}

// Функция для проверки и корректировки даты
function validateAndAdjustDate(day: string, month: string, year: string): { day: string; month: string; year: string } {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);

    const maxDays = getDaysInMonth(yearNum, monthNum);

    if (dayNum > maxDays) {
        return {
            day: maxDays.toString().padStart(2, '0'),
            month: month.padStart(2, '0'),
            year: year
        };
    }

    return {
        day: day.padStart(2, '0'),
        month: month.padStart(2, '0'),
        year: year
    };
}

interface DatePickerProps {
    value: string;
    onChange: (date: string) => void;
    minDate?: string;
    maxDate?: string;
    defaultDate?: string;
    disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   value,
                                                   onChange,
                                                   minDate = '1960-01-01',
                                                   maxDate = getDefaultMaxDate(),
                                                   defaultDate = '2000-01-01',
                                                   disabled = false
                                               }) => {
    const [day, setDay] = useState('01');
    const [month, setMonth] = useState('01');
    const [year, setYear] = useState('2000');

    // Генерация диапазонов чисел
    const generateNumbers = (start: number, end: number): number[] => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // Получаем дни, месяцы и годы
    const days = generateNumbers(1, 31);
    const months = generateNumbers(1, 12);
    const years = generateNumbers(parseInt(minDate.split('-')[0]), parseInt(maxDate.split('-')[0]));

    // Преобразование даты в формат YYYY-MM-DD
    const formatDate = (d: string, m: string, y: string): string => {
        const validatedDate = validateAndAdjustDate(d, m, y);
        return `${validatedDate.year}-${validatedDate.month}-${validatedDate.day}`;
    };

    // Инициализация значений из props
    useEffect(() => {
        if (value) {
            const [y, m, d] = value.split('-');
            const validatedDate = validateAndAdjustDate(d, m, y);
            setYear(validatedDate.year);
            setMonth(validatedDate.month);
            setDay(validatedDate.day);
        } else if (defaultDate) {
            const [y, m, d] = defaultDate.split('-');
            const validatedDate = validateAndAdjustDate(d, m, y);
            setYear(validatedDate.year);
            setMonth(validatedDate.month);
            setDay(validatedDate.day);
            onChange(formatDate(validatedDate.day, validatedDate.month, validatedDate.year));
        }
    }, [value, defaultDate, onChange]);

    // Обработка изменения значений
    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDay = e.target.value;
        const validatedDate = validateAndAdjustDate(newDay, month, year);

        setDay(validatedDate.day);
        setMonth(validatedDate.month);
        setYear(validatedDate.year);
        onChange(formatDate(validatedDate.day, validatedDate.month, validatedDate.year));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = e.target.value;
        const validatedDate = validateAndAdjustDate(day, newMonth, year);

        setDay(validatedDate.day);
        setMonth(validatedDate.month);
        setYear(validatedDate.year);
        onChange(formatDate(validatedDate.day, validatedDate.month, validatedDate.year));
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = e.target.value;
        const validatedDate = validateAndAdjustDate(day, month, newYear);

        setDay(validatedDate.day);
        setMonth(validatedDate.month);
        setYear(validatedDate.year);
        onChange(formatDate(validatedDate.day, validatedDate.month, validatedDate.year));
    };

    // Получаем актуальное количество дней для текущего месяца и года
    const getCurrentDays = (): number[] => {
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);
        const daysInMonth = getDaysInMonth(yearNum, monthNum);
        return generateNumbers(1, daysInMonth);
    };

    return (
        <div className="date-picker-wheel">
            <div className="date-wheel-container">
                <div className="date-wheel-column">
                    <select
                        value={day}
                        onChange={handleDayChange}
                        className="date-wheel-select"
                        aria-label="День"
                        disabled={disabled}
                    >
                        {getCurrentDays().map(d => (
                            <option key={d} value={d.toString().padStart(2, '0')}>
                                {d.toString().padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                    <span className="date-wheel-label">День</span>
                </div>

                <div className="date-wheel-column">
                    <select
                        value={month}
                        onChange={handleMonthChange}
                        className="date-wheel-select"
                        aria-label="Месяц"
                        disabled={disabled}
                    >
                        {months.map(m => (
                            <option key={m} value={m.toString().padStart(2, '0')}>
                                {m.toString().padStart(2, '0')}
                            </option>
                        ))}
                    </select>
                    <span className="date-wheel-label">Месяц</span>
                </div>

                <div className="date-wheel-column">
                    <select
                        value={year}
                        onChange={handleYearChange}
                        className="date-wheel-select"
                        aria-label="Год"
                        disabled={disabled}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                    <span className="date-wheel-label">Год</span>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;