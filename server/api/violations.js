import { API_URL } from './config';

const sendGet = async (path) => {
    try {
        const response = await fetch(API_URL + path);
        const data = await response.json();

        if (!response.ok) { return { error: data.message || 'Помилка сервера' }; }
        return { data };
    } catch (error) {
        console.error('Network error:', error);
        return { error: 'Немає зв\'язку з сервером' };
    }
};

export const fetchDatesRequest = (from, to) => {
    return sendGet('/violations/dates?from=' + from + '&to=' + to);
};
export const fetchByDateRequest = (date) => {
    return sendGet('/violations/by-date?date=' + date);
};
export const fetchLocationsRequest = () => {
    return sendGet('/violations/locations');
};
export const fetchByLocationRequest = (lat, lng) => {
    return sendGet('/violations/by-location?lat=' + lat + '&lng=' + lng);
};
