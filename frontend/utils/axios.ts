import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    // Use your machine's local IP (e.g., http://192.168.1.x:8000/api) if on a physical device
    baseURL: 'http://10.0.2.2:8000/api',
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;