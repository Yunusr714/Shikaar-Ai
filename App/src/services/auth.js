import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach host localhost
const BASE_URL = Platform.select({
    android: 'http://192.168.137.212:8000',
    ios: 'http://localhost:8000',
    default: 'http://localhost:8000',
});

const TOKEN_KEY = '@shikaar_token';

const authApi = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// ── Token persistence ───────────────────────────────────────────────────
export const saveToken = async (token) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
    return AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
};

// ── Auth API calls ──────────────────────────────────────────────────────
export const registerUser = async (name, email, phone, password) => {
    const { data } = await authApi.post('/api/auth/register', {
        name,
        email,
        phone,
        password,
    });
    await saveToken(data.access_token);
    return data;
};

export const loginUser = async (email, password) => {
    const { data } = await authApi.post('/api/auth/login', {
        email,
        password,
    });
    await saveToken(data.access_token);
    return data;
};

export const logoutUser = async () => {
    await removeToken();
};

export default authApi;
