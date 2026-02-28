import axios from 'axios';
import { Platform } from 'react-native';
import { VEHICLE_OPTIONS, DRIVER_INFO, RIDE_HISTORY, USER_PROFILE } from '../data/mockData';
import { getToken } from './auth';

// Base axios instance — points to the FastAPI backend
const BASE_URL = Platform.select({
    android: 'http://192.168.137.212:8000',
    ios: 'http://localhost:8000',
    default: 'http://localhost:8000',
});

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth interceptor — attach JWT token to all requests
api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Mock delay to simulate network (for endpoints still using mock)
const mockDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Real API functions ──────────────────────────────────────────────────

export const getChatResponse = async (message) => {
    const { data } = await api.post('/api/chat', { query: message });
    return {
        success: true,
        data: {
            response: data.answer,
            timestamp: new Date().toISOString(),
        },
    };
};

export const getUserProfile = async () => {
    try {
        const { data } = await api.get('/api/users/me');
        return { success: true, data };
    } catch {
        // Fallback to mock
        await mockDelay(400);
        return { success: true, data: USER_PROFILE };
    }
};

export const updateUserProfile = async (updates) => {
    try {
        const { data } = await api.put('/api/users/me', updates);
        return { success: true, data };
    } catch {
        await mockDelay(800);
        return { success: true, data: { ...USER_PROFILE, ...updates } };
    }
};

export const getRideHistory = async (page = 1, pageSize = 20) => {
    try {
        const { data } = await api.get('/api/rides/history', {
            params: { page, page_size: pageSize },
        });
        return { success: true, data: data.rides };
    } catch {
        await mockDelay(600);
        return { success: true, data: RIDE_HISTORY };
    }
};

// ── Mock API functions (booking flow — still simulated) ─────────────────

export const searchRides = async (pickup, drop) => {
    await mockDelay(800);
    return {
        success: true,
        data: {
            vehicles: VEHICLE_OPTIONS,
            estimatedTime: '12 min',
            estimatedDistance: '4.2 km',
            route: { pickup, drop },
        },
    };
};

export const confirmBooking = async (vehicleId, paymentMethodId) => {
    await mockDelay(1500);
    return {
        success: true,
        data: {
            bookingId: `BK${Date.now()}`,
            vehicle: VEHICLE_OPTIONS.find((v) => v.id === vehicleId),
            status: 'searching',
            estimatedPickup: '5 mins',
        },
    };
};

export const getRideStatus = async (bookingId) => {
    await mockDelay(500);
    return {
        success: true,
        data: {
            bookingId,
            status: 'arriving',
            driver: DRIVER_INFO,
            eta: '2 mins',
            distance: '0.5 km',
        },
    };
};

export default api;
