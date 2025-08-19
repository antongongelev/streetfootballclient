import React from 'react';
import '../../styles/global.css';

interface BadgeProps {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
                                                variant = 'default',
                                                size = 'md',
                                                children,
                                                className = '',
                                            }) => {
    const baseClasses = `badge badge-${variant} badge-${size} ${className}`;

    return (
        <span className={baseClasses}>
      {children}
    </span>
    );
};