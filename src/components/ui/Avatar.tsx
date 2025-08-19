import React from 'react';
import '../../styles/global.css';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
                                                  src,
                                                  alt = 'User avatar',
                                                  size = 'md',
                                                  className = '',
                                              }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
    };

    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={`avatar ${sizeClasses[size]} ${className}`}
            />
        );
    }

    return (
        <div className={`avatar avatar-placeholder ${sizeClasses[size]} ${className}`}>
            <span className="avatar-initials">?</span>
        </div>
    );
};