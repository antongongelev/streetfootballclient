import React from 'react';
import '../../styles/global.css';

interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small' | 'caption';
    children: React.ReactNode;
    className?: string;
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: 'primary' | 'secondary' | 'muted' | 'success' | 'error';
}

export const Typography: React.FC<TypographyProps> = ({
                                                          variant = 'body',
                                                          children,
                                                          className = '',
                                                          weight = 'normal',
                                                          color = 'primary',
                                                      }) => {
    const Tag = variant.startsWith('h') ? variant : 'p';

    const baseClasses = `typography typography-${variant} weight-${weight} color-${color} ${className}`;

    return React.createElement(Tag, { className: baseClasses }, children);
};