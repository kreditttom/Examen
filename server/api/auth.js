import { API_URL } from './config';

const sendPost = async (path, body) => {
    try {
        const response = await fetch(API_URL + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await response.json();

        if (!response.ok) { return { error: data.message || 'Помилка сервера' }; }
        return { data };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Немає зв\'язку з сервером' };
    }
};

export const registerRequest = (firstName, lastName, email, password) => {
    return sendPost('/auth/register', { firstName, lastName, email, password });
};

export const loginRequest = (email, password) => {
    return sendPost('/auth/login', { email, password });
};