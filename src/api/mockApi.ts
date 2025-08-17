interface ApiResponse {
    success: boolean;
    user?: {
        id: number;
        name: string;
    };
}

export const fetchUser = async (telegramUserId: number | null): Promise<ApiResponse> => {
    // Имитация запроса к бекенду
    return new Promise((resolve) => {
        setTimeout(() => {
            if (telegramUserId) {
                resolve({
                    success: true,
                    user: { id: telegramUserId, name: 'Иван' }
                });
            } else {
                resolve({ success: false });
            }
        }, 1500); // Задержка 1.5 сек
    });
};