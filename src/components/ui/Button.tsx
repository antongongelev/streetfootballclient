import React from 'react';
import '../../styles/global.css';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  size = 'md',
                                                  disabled = false,
                                                  onClick,
                                                  className = '',
                                                  type = 'button',
                                              }) => {
    const baseClasses = `btn btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`;

    return (
        <button
            type={type}
            className={baseClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};