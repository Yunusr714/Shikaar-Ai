import { create } from 'zustand';
import { VEHICLE_OPTIONS, DRIVER_INFO, RIDE_HISTORY, CHATBOT_RESPONSES } from '../data/mockData';
import { getToken, removeToken } from '../services/auth';
import axios from 'axios';
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
    android: 'http://192.168.137.212:8000',
    ios: 'http://localhost:8000',
    default: 'http://localhost:8000',
});

const useAppStore = create((set, get) => ({
    // ── Auth ────────────────────────────────────────────────────────────
    authToken: null,
    isAuthenticated: false,
    authChecked: false, // true after we've checked AsyncStorage
    user: {
        id: null,
        name: '',
        email: '',
        phone: '',
        avatar: 'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128&bold=true',
        rating: 5.0,
        membershipTier: 'Standard',
        location: '',
        totalRides: 0,
        joinedDate: '',
    },

    setAuth: (token, userData) =>
        set({
            authToken: token,
            isAuthenticated: true,
            authChecked: true,
            user: { ...get().user, ...userData },
        }),

    logout: async () => {
        await removeToken();
        set({
            authToken: null,
            isAuthenticated: false,
            user: {
                id: null,
                name: '',
                email: '',
                phone: '',
                avatar: 'https://ui-avatars.com/api/?name=User&background=FF6B35&color=fff&size=128&bold=true',
                rating: 5.0,
                membershipTier: 'Standard',
                location: '',
                totalRides: 0,
                joinedDate: '',
            },
            chatMessages: [
                {
                    id: 'msg_welcome',
                    type: 'bot',
                    text: CHATBOT_RESPONSES.greeting.text,
                    timestamp: new Date(),
                },
            ],
        });
    },

    checkAuth: async () => {
        const token = await getToken();
        if (token) {
            // Validate token by fetching user profile
            try {
                const { data } = await axios.get(`${BASE_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000,
                });
                set({
                    authToken: token,
                    isAuthenticated: true,
                    authChecked: true,
                    user: {
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        avatar: data.avatar,
                        rating: data.rating,
                        membershipTier: data.membership_tier,
                        location: data.location,
                        totalRides: data.total_rides,
                        joinedDate: data.joined_date,
                    },
                });
            } catch {
                // Token expired or invalid
                await removeToken();
                set({ authToken: null, isAuthenticated: false, authChecked: true });
            }
        } else {
            set({ authChecked: true });
        }
    },

    loadUserProfile: async () => {
        const token = get().authToken;
        if (!token) return;
        try {
            const { data } = await axios.get(`${BASE_URL}/api/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            });
            set({
                user: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    avatar: data.avatar,
                    rating: data.rating,
                    membershipTier: data.membership_tier,
                    location: data.location,
                    totalRides: data.total_rides,
                    joinedDate: data.joined_date,
                },
            });
        } catch {
            // Silently fail — keep cached data
        }
    },

    // ── Booking state ───────────────────────────────────────────────────
    booking: {
        pickup: '',
        pickupAddress: '',
        drop: '',
        dropAddress: '',
        selectedVehicle: VEHICLE_OPTIONS[1], // Sedan default
        status: null,
        driver: null,
        estimatedTime: '12 min',
        estimatedDistance: '4.2 km',
        fare: 18.00,
    },

    // Payment
    selectedPayment: { id: 'pm1', type: 'visa', label: 'Personal Visa', last4: '4242' },

    // Ride History
    rideHistory: RIDE_HISTORY,

    // Chat
    chatMessages: [
        {
            id: 'msg_welcome',
            type: 'bot',
            text: CHATBOT_RESPONSES.greeting.text,
            timestamp: new Date(),
        },
    ],
    isBotTyping: false,

    // Notifications
    notifications: [],

    // ── Booking Actions ─────────────────────────────────────────────────
    setPickup: (pickup, address) =>
        set((state) => ({
            booking: { ...state.booking, pickup, pickupAddress: address || pickup },
        })),

    setDrop: (drop, address) =>
        set((state) => ({
            booking: { ...state.booking, drop, dropAddress: address || drop },
        })),

    selectVehicle: (vehicle) =>
        set((state) => ({
            booking: { ...state.booking, selectedVehicle: vehicle, fare: vehicle.fare },
        })),

    setSelectedPayment: (payment) => set({ selectedPayment: payment }),

    updateRideStatus: (status) =>
        set((state) => {
            const updates = { status };
            if (status === 'driverAssigned') {
                updates.driver = DRIVER_INFO;
            }
            return { booking: { ...state.booking, ...updates } };
        }),

    resetBooking: () =>
        set({
            booking: {
                pickup: '',
                pickupAddress: '',
                drop: '',
                dropAddress: '',
                selectedVehicle: VEHICLE_OPTIONS[1],
                status: null,
                driver: null,
                estimatedTime: '12 min',
                estimatedDistance: '4.2 km',
                fare: 18.00,
            },
        }),

    // ── Chat Actions ────────────────────────────────────────────────────
    addChatMessage: (message) =>
        set((state) => ({
            chatMessages: [...state.chatMessages, { ...message, id: `msg_${Date.now()}`, timestamp: new Date() }],
        })),

    setBotTyping: (isTyping) => set({ isBotTyping: isTyping }),

    sendChatMessage: async (text) => {
        const { addChatMessage, setBotTyping, authToken, chatMessages } = get();

        // Add user message
        addChatMessage({ type: 'user', text });

        // Simulate bot typing
        setBotTyping(true);

        try {
            // Try real backend
            if (authToken) {
                // Build conversation history from recent messages (last 6)
                const recentMsgs = chatMessages.slice(-6);
                const history = recentMsgs
                    .filter((m) => m.type === 'user' || m.type === 'bot')
                    .map((m) => ({
                        role: m.type === 'user' ? 'user' : 'assistant',
                        content: m.text,
                    }));

                const { data } = await axios.post(
                    `${BASE_URL}/api/chat`,
                    { query: text, history },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 30000,
                    },
                );
                setBotTyping(false);
                addChatMessage({
                    type: 'bot',
                    text: data.answer,
                    steps: data.steps && data.steps.length > 0 ? data.steps : undefined,
                    _animate: true,
                });
                return;
            }
        } catch {
            // Fall through to mock responses
        }

        // Fallback: mock keyword-based responses
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const lowerText = text.toLowerCase();
        let response = CHATBOT_RESPONSES.default;

        if (lowerText.includes('book') && lowerText.includes('ride')) {
            response = CHATBOT_RESPONSES['how to book a ride'];
        } else if (lowerText.includes('driver') && lowerText.includes('assign')) {
            response = CHATBOT_RESPONSES['how is driver assigned'];
        } else if (lowerText.includes('cancel')) {
            response = CHATBOT_RESPONSES['cancellation policy'];
        } else if (lowerText.includes('safe') || lowerText.includes('sos')) {
            response = CHATBOT_RESPONSES['safety features'];
        }

        setBotTyping(false);
        addChatMessage({ type: 'bot', text: response.text, steps: response.steps });
    },
}));

export default useAppStore;
