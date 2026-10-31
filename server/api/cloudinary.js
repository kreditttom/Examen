import { CLOUD_NAME, UPLOAD_PRESET } from './config';

export const uploadPhoto = async (dataUri) => {
    try {
        const formData = new FormData();
        formData.append('file', dataUri);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(
            'https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload',
            { method: 'POST', body: formData }
        );
        const data = await response.json();

        if (!response.ok) { return { error: (data.error && data.error.message) || 'Помилка Cloudinary' };}
        return { data: data.secure_url };
    } catch (error) {
        console.log('Cloudinary error:', error);
        return { error: 'Немає зв\'язку з Cloudinary' };
    }
};