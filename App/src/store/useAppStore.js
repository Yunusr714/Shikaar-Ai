import { create } from 'zustand';
import { USER_PROFILE, VEHICLE_OPTIONS, DRIVER_INFO, RIDE_HISTORY, CHATBOT_RESPONSES } from '../data/mockData';

const useAppStore = create((set, get) => ({
    // User
    user: USER_PROFILE,

    // Booking state
    booking: {
        pickup: '',
        pickupAddress: '',
        drop: '',
        dropAddress: '',
        selectedVehicle: VEHICLE_OPTIONS[1], // Sedan default
        status: null, // null | searching | driverAssigned | arriving | tripStarted | completed
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

    // Actions
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

    addChatMessage: (message) =>
        set((state) => ({
            chatMessages: [...state.chatMessages, { ...message, id: `msg_${Date.now()}`, timestamp: new Date() }],
        })),

    setBotTyping: (isTyping) => set({ isBotTyping: isTyping }),

    sendChatMessage: async (text) => {
        const { addChatMessage, setBotTyping } = get();

        // Add user message
        addChatMessage({ type: 'user', text });

        // Simulate bot typing
        setBotTyping(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Find matching response
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
