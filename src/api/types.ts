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

// Другие DTO можно добавлять здесь