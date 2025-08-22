// components/AvatarEditorModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface AvatarEditorModalProps {
    imageSrc: string;
    onSave: (croppedImage: Blob) => void;
    onCancel: () => void;
}

const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({
                                                                 imageSrc,
                                                                 onSave,
                                                                 onCancel
                                                             }) => {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90, // Уменьшаем начальную область обрезки
        height: 90,
        x: 5,
        y: 5
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Ждем полной загрузки изображения
    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const getCroppedImg = async (): Promise<Blob> => {
        const image = imgRef.current;

        // Добавляем больше проверок
        if (!image || !completedCrop || !isImageLoaded) {
            throw new Error('Crop canvas does not exist or image not loaded');
        }

        // Проверяем валидность crop области
        if (completedCrop.width === 0 || completedCrop.height === 0) {
            throw new Error('Crop area is too small');
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Убеждаемся что размеры не нулевые
        const cropWidth = Math.max(1, completedCrop.width);
        const cropHeight = Math.max(1, completedCrop.height);

        canvas.width = cropWidth;
        canvas.height = cropHeight;

        try {
            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                cropWidth,
                cropHeight
            );

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    resolve(blob);
                }, 'image/jpeg', 0.9);
            });
        } catch (error) {
            throw new Error('Failed to crop image');
        }
    };

    const handleSave = async () => {
        try {
            if (!isImageLoaded) {
                throw new Error('Image not loaded yet');
            }

            const croppedImage = await getCroppedImg();
            onSave(croppedImage);
        } catch (error) {
            console.error('Error cropping image:', error);
            // Можно показать сообщение пользователю
            alert('Ошибка при обрезке изображения. Попробуйте еще раз.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Обрежьте аватар</h3>

                <div className="crop-container">
                    {!isImageLoaded && (
                        <div className="loading-overlay">
                            <div>Загрузка изображения...</div>
                        </div>
                    )}

                    <ReactCrop
                        crop={crop}
                        onChange={setCrop}
                        onComplete={setCompletedCrop}
                        aspect={1}
                        circularCrop
                        disabled={!isImageLoaded}
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop me"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '60vh',
                                opacity: isImageLoaded ? 1 : 0.5
                            }}
                            onLoad={handleImageLoad}
                            onError={() => console.error('Failed to load image')}
                        />
                    </ReactCrop>
                </div>

                <div className="modal-actions">
                    <button
                        className="tg-button secondary"
                        onClick={onCancel}
                        type="button"
                    >
                        Отмена
                    </button>
                    <button
                        className="tg-button"
                        onClick={handleSave}
                        disabled={!isImageLoaded || !completedCrop}
                        type="button"
                    >
                        {isImageLoaded ? 'Сохранить' : 'Загрузка...'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarEditorModal;