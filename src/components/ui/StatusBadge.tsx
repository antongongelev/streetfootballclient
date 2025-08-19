import React from 'react';
import { Badge } from './Badge';

interface StatusBadgeProps {
    status: 'success' | 'processing' | 'pending' | 'failed' | 'default';
    children?: React.ReactNode;
}

const statusConfig = {
    success: { label: 'Success', variant: 'success' as const },
    processing: { label: 'Processing', variant: 'primary' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    failed: { label: 'Failed', variant: 'error' as const },
    default: { label: 'Default', variant: 'default' as const },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                            status,
                                                            children,
                                                        }) => {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} size="sm">
            {children || config.label}
        </Badge>
    );
};