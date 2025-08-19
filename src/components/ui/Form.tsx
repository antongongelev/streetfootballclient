import React from 'react';
import '../../styles/global.css';

interface FormProps {
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
    className?: string;
}

export const Form: React.FC<FormProps> = ({
                                              children,
                                              onSubmit,
                                              className = '',
                                          }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form onSubmit={handleSubmit} className={`form ${className}`}>
            {children}
        </form>
    );
};

interface FormFieldProps {
    children: React.ReactNode;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
                                                        children,
                                                        className = '',
                                                    }) => {
    return (
        <div className={`form-field ${className}`}>
            {children}
        </div>
    );
};