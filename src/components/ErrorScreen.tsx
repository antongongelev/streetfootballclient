import React from 'react';

interface ErrorScreenProps {
    message?: string; // Опциональное сообщение об ошибке
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
                                                     message = "Не удалось загрузить данные. Попробуйте позже."
                                                 }) => {
    return (
        <div className="screen-container">
            <div className="error-message">
                <h2>Ошибка!</h2>
                <p>{message}</p> {/* Используем переданное сообщение */}
            </div>
        </div>
    );
};

export default ErrorScreen;