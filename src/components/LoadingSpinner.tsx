// components/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 20,
                                                           color = 'currentColor'
                                                       }) => {
    return (
        <div
            className="loading-spinner"
            style={{
                width: size,
                height: size,
                border: `2px solid ${color}`,
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}
        />
    );
};

export default LoadingSpinner;