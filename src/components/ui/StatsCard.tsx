import React from 'react';
import { Card } from './Card';
import { Typography } from './Typography';
import { Badge } from './Badge';

interface StatsCardProps {
    title: string;
    value: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
                                                        title,
                                                        value,
                                                        trend,
                                                        icon,
                                                        className = '',
                                                    }) => {
    return (
        <Card padding="md" className={className}>
            <div className="stats-card-header">
                <Typography variant="small" color="muted">
                    {title}
                </Typography>
                {icon && <div className="stats-card-icon">{icon}</div>}
            </div>

            <Typography variant="h3" weight="bold" className="stats-card-value">
                {value}
            </Typography>

            {trend && (
                <div className="stats-card-trend">
                    <Badge
                        variant={trend.isPositive ? 'success' : 'error'}
                        size="sm"
                    >
                        {trend.isPositive ? '↑' : '↓'} {trend.value}
                    </Badge>
                    <Typography variant="caption" color="muted">
                        from last month
                    </Typography>
                </div>
            )}
        </Card>
    );
};