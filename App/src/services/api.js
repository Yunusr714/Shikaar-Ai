import axios from 'axios';
import { VEHICLE_OPTIONS, DRIVER_INFO, RIDE_HISTORY, USER_PROFILE } from '../data/mockData';

// Base axios instance - point to your backend later
const api = axios.create({
    baseURL: 'https://api.shikaar.ai/v1', // placeholder
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock delay to simulate network
const mockDelay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
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

export const getChatResponse = async (message) => {
    await mockDelay(1200);
    return {
        success: true,
        data: {
            response: 'This is a mock response from the AI assistant.',
            timestamp: new Date().toISOString(),
        },
    };
};

export const getRideHistory = async () => {
    await mockDelay(600);
    return {
        success: true,
        data: RIDE_HISTORY,
    };
};

export const getUserProfile = async () => {
    await mockDelay(400);
    return {
        success: true,
        data: USER_PROFILE,
    };
};

export const updateUserProfile = async (updates) => {
    await mockDelay(800);
    return {
        success: true,
        data: { ...USER_PROFILE, ...updates },
    };
};

export default api;
