// Базовые типы
export type ApiResponse<T> = {
    data: T;
    status: number;
};

export type ApiError = {
    message: string;
    status?: number;
    code?: string;
};

// Конкретные DTO
export type Player = {
    id: number;
    telegramId: number;
    nickname: string;
    birthDate: string;
    primaryPosition: string;
    secondaryPosition: string | null;
    avatar: string | null;
    createdAt: string;
};

export interface RegistrationData {
    nickname: string;
    male: boolean;
    birthDate: string;
    primaryPosition: string;
    secondaryPosition: string | null;
}

// Константы для позиций
export const POSITIONS = {
    GK: 'Вратарь',
    DEF: 'Защитник',
    MID: 'Полузащитник',
    FWD: 'Нападающий'
} as const;

export type PositionCode = keyof typeof POSITIONS;

// Функция для получения названия позиции по коду
export const getPositionName = (code: string): string => {
    return POSITIONS[code as PositionCode] || code;
};

// types/react-image-crop.d.ts
declare module 'react-image-crop' {
    export interface Crop {
        unit?: 'px' | '%';
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }

    export interface PixelCrop extends Crop {
        unit: 'px';
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface ReactCropProps {
        crop: Crop;
        onChange: (crop: Crop) => void;
        onComplete?: (crop: PixelCrop) => void;
        children: React.ReactNode;
        aspect?: number;
        circularCrop?: boolean;
    }

    const ReactCrop: React.FC<ReactCropProps>;
}