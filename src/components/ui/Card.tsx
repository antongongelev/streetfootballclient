import React from 'react';
import '../../styles/global.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className = '',
                                              padding = 'md',
                                              shadow = 'md',
                                          }) => {
    const baseClasses = `card card-padding-${padding} card-shadow-${shadow} ${className}`;

    return (
        <div className={baseClasses}>
            {children}
        </div>
    );
};