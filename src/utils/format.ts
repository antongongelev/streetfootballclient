// Функция для форматирования даты
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Функция для перевода позиций на русский
export const translatePosition = (position: string): string => {
    const positions: { [key: string]: string } = {
        'FORWARD': 'Нападающий',
        'HALFBACK': 'Полузащитник',
        'DEFENDER': 'Защитник',
        'GOALKEEPER': 'Вратарь'
    };

    return positions[position] || position;
};

// Функция для вычисления возраста
export const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
};