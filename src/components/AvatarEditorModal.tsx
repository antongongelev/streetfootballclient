// components/AvatarEditorModal.tsx
import React, { useState, useRef } from 'react';
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
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);

    const getCroppedImg = async (): Promise<Blob> => {
        const image = imgRef.current;
        if (!image || !completedCrop) {
            throw new Error('Crop canvas does not exist');
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    throw new Error('Canvas is empty');
                }
                resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    };

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg();
            onSave(croppedImage);
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Обрежьте аватар</h3>

                <div className="crop-container">
                    <ReactCrop
                        crop={crop}
                        onChange={setCrop}
                        onComplete={setCompletedCrop}
                        aspect={1}
                        circularCrop
                    >
                        <img
                            ref={imgRef}
                            src={imageSrc}
                            alt="Crop me"
                            style={{ maxWidth: '100%', maxHeight: '60vh' }}
                        />
                    </ReactCrop>
                </div>

                <div className="modal-actions">
                    <button className="tg-button secondary" onClick={onCancel}>
                        Отмена
                    </button>
                    <button className="tg-button" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarEditorModal;