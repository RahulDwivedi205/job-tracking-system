import apiClient from './apiClient';

export const loginUser = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
};

export const signupUser = async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData);
    return data;
};

export const getMe = async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
};