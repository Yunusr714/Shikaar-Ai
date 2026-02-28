export const USER_PROFILE = {
    id: 'user_001',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    membershipTier: 'Gold Member',
    location: 'New Delhi, India',
    totalRides: 156,
    joinedDate: 'Jan 2024',
};

export const SAVED_PLACES = [
    { id: 'sp1', label: 'Home', address: '42, Rajouri Garden, New Delhi', icon: 'home' },
    { id: 'sp2', label: 'Work', address: 'Tech Hub Office, Block B, Noida', icon: 'briefcase' },
    { id: 'sp3', label: 'Saved', address: 'Central Mall Plaza, Gurgaon', icon: 'star' },
];

export const SPECIAL_OFFERS = [
    {
        id: 'offer1',
        title: '20% off your\nweekend rides',
        code: 'WKND20',
        tag: 'LIMITED TIME',
        bgColor: '#1A1A2E',
        textColor: '#FFFFFF',
    },
    {
        id: 'offer2',
        title: 'Invite Friends',
        subtitle: 'Get $10 for everyone who joins',
        tag: 'NEW',
        bgColor: '#F0EAFF',
        textColor: '#1A1A2E',
        action: 'Invite Now',
    },
];

export const RECENT_RIDES = [
    {
        id: 'rr1',
        pickup: 'Home',
        drop: 'Central Station',
        date: 'Yesterday, 5:42 PM',
        fare: '$14.50',
        status: 'completed',
    },
    {
        id: 'rr2',
        pickup: 'Work',
        drop: 'City Mall Plaza',
        date: 'Mon, 10:00 AM',
        fare: '$22.00',
        status: 'completed',
    },
];

export const TOP_DESTINATIONS = [
    { id: 'td1', name: 'Airport Terminal 1', time: '45 mins', fare: '$35-42' },
    { id: 'td2', name: 'National Stadium', time: '20 mins', fare: '$18-25' },
    { id: 'td3', name: 'City Center Mall', time: '15 mins', fare: '$12-18' },
    { id: 'td4', name: 'Railway Station', time: '30 mins', fare: '$22-28' },
];

export const VEHICLE_OPTIONS = [
    {
        id: 'v1',
        name: 'Shikaar Mini',
        eta: '3 mins away',
        seats: 4,
        fare: 12.50,
        image: '🚗',
        description: 'Affordable rides',
    },
    {
        id: 'v2',
        name: 'Shikaar Sedan',
        eta: '5 mins away',
        seats: 4,
        fare: 18.00,
        image: '🚙',
        description: 'Comfortable rides',
        badge: 'BEST VALUE',
        selected: true,
    },
    {
        id: 'v3',
        name: 'Shikaar SUV',
        eta: '8 mins away',
        seats: 6,
        fare: 28.50,
        image: '🚐',
        description: 'Spacious rides',
    },
];

export const PAYMENT_METHODS = {
    cards: [
        { id: 'pm1', type: 'visa', label: 'Personal Visa', last4: '4242', isDefault: true },
        { id: 'pm2', type: 'mastercard', label: 'Business Card', last4: '8899', isDefault: false },
    ],
    upi: [
        { id: 'pm3', type: 'gpay', label: 'Google Pay', subtitle: 'user@okhdfcbank' },
        { id: 'pm4', type: 'phonepe', label: 'PhonePe', subtitle: 'Link account' },
    ],
    other: [
        { id: 'pm5', type: 'cash', label: 'Cash', subtitle: 'Pay directly to driver' },
    ],
};

export const DRIVER_INFO = {
    id: 'driver_001',
    name: 'Rahul Kumar',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    vehicle: 'White Swift Dzire',
    plateNumber: 'DL 3C AE 2931',
    phone: '+91 99999 88888',
    totalRides: 2340,
    verified: true,
};

export const RIDE_STATUSES = [
    { id: 'rs1', label: 'Searching', icon: 'search', completed: true },
    { id: 'rs2', label: 'Driver Assigned', icon: 'person', completed: true },
    { id: 'rs3', label: 'Arriving', icon: 'car', completed: true, active: true },
    { id: 'rs4', label: 'Trip Started', icon: 'navigation', completed: false },
    { id: 'rs5', label: 'Completed', icon: 'checkmark-circle', completed: false },
];

export const RIDE_HISTORY = [
    {
        id: 'rh1',
        pickup: 'Home',
        drop: 'Tech Hub Office, Block B',
        date: 'Oct 24, 9:30 AM',
        fare: '$25.50',
        status: 'completed',
        vehicle: 'Shikaar Sedan',
    },
    {
        id: 'rh2',
        pickup: 'Downtown Plaza',
        drop: 'International Airport T2',
        date: 'Oct 20, 6:15 PM',
        fare: '$45.00',
        status: 'completed',
        vehicle: 'Shikaar SUV',
    },
    {
        id: 'rh3',
        pickup: 'Gym',
        drop: 'Whole Foods Market',
        date: 'Oct 18, 8:00 AM',
        fare: '$12.00',
        status: 'cancelled',
        vehicle: 'Shikaar Mini',
    },
    {
        id: 'rh4',
        pickup: "Friend's House",
        drop: 'Home',
        date: 'Oct 15, 10:45 PM',
        fare: '$18.25',
        status: 'completed',
        vehicle: 'Shikaar Sedan',
    },
    {
        id: 'rh5',
        pickup: 'Office',
        drop: 'Central Mall',
        date: 'Oct 12, 1:30 PM',
        fare: '$15.75',
        status: 'completed',
        vehicle: 'Shikaar Mini',
    },
];

export const CHATBOT_RESPONSES = {
    greeting: {
        text: "Hello! I'm your Shikaar assistant. I can help explain how our intelligent routing works or assist with booking issues. What would you like to know today?",
    },
    'how to book a ride': {
        text: 'Booking is simple! Just follow these 3 steps to get moving:',
        steps: [
            {
                icon: 'location',
                title: 'Set Pickup',
                description: 'Confirm your current location on the map so the driver can find you easily.',
            },
            {
                icon: 'flag',
                title: 'Choose Destination',
                description: 'Enter where you want to go. You can add multiple stops if needed.',
            },
            {
                icon: 'car',
                title: 'Select Ride & Confirm',
                description: 'Pick a ride type that fits your budget and hit "Request Shikaar".',
            },
        ],
    },
    'how is driver assigned': {
        text: 'Our smart matching system works in real-time:',
        steps: [
            {
                icon: 'radar',
                title: 'Proximity Search',
                description: 'We scan for available drivers within a 3km radius of your pickup point.',
            },
            {
                icon: 'star',
                title: 'Rating & Match',
                description: 'Drivers are ranked by rating, distance, and route compatibility.',
            },
            {
                icon: 'flash',
                title: 'Instant Assignment',
                description: 'The best match is notified and has 15 seconds to accept your ride.',
            },
        ],
    },
    'cancellation policy': {
        text: 'Here\'s our fair cancellation policy:',
        steps: [
            {
                icon: 'time',
                title: 'Free Cancellation',
                description: 'Cancel within 2 minutes of booking at no charge.',
            },
            {
                icon: 'cash',
                title: 'Late Cancellation Fee',
                description: 'A small fee of $3-5 applies after 2 minutes to compensate the driver.',
            },
            {
                icon: 'shield',
                title: 'No-Show Protection',
                description: 'If the driver doesn\'t arrive within 10 minutes, cancel for free.',
            },
        ],
    },
    'safety features': {
        text: 'Your safety is our top priority. Here\'s what we offer:',
        steps: [
            {
                icon: 'shield-checkmark',
                title: 'Verified Drivers',
                description: 'All drivers undergo background checks and document verification.',
            },
            {
                icon: 'location',
                title: 'Live Trip Sharing',
                description: 'Share your real-time location with trusted contacts during every ride.',
            },
            {
                icon: 'alert-circle',
                title: 'Emergency SOS',
                description: 'One-tap SOS button connects you instantly to emergency services.',
            },
            {
                icon: 'call',
                title: '24/7 Support',
                description: 'Our safety team is available around the clock for any concerns.',
            },
        ],
    },
    default: {
        text: "I can help explain various features of Shikaar! Try asking about:\n• How to book a ride\n• How drivers are assigned\n• Cancellation policy\n• Safety features\n• Payment methods\n• Ride tracking",
    },
};

export const QUICK_SUGGESTIONS = [
    'How is driver assigned?',
    'Safety features?',
    'Cancellation policy',
    'Payment methods?',
    'Track my ride',
];

export const SAFETY_FEATURES = [
    { id: 'sf1', icon: 'headset', title: '24/7 Support', subtitle: 'Instant help anytime' },
    { id: 'sf2', icon: 'locate', title: 'Live Location', subtitle: 'Share with loved ones' },
    { id: 'sf3', icon: 'warning', title: 'Emergency SOS', subtitle: 'Alert authorities' },
    { id: 'sf4', icon: 'shield-checkmark', title: 'Verified Drivers', subtitle: 'Background checked' },
];

export const PROFILE_MENU = {
    accountSettings: [
        { id: 'pm1', icon: 'person', label: 'Personal Information', route: 'PersonalInfo' },
        { id: 'pm2', icon: 'card', label: 'Payment Methods', subtitle: 'Visa ••4242', route: 'PaymentMethods' },
        { id: 'pm3', icon: 'time', label: 'Ride History', route: 'RideHistory' },
    ],
    preferences: [
        { id: 'pm4', icon: 'notifications', label: 'Notifications', toggle: true, value: true },
        { id: 'pm5', icon: 'lock-closed', label: 'Privacy & Security', route: 'Privacy' },
        { id: 'pm6', icon: 'globe', label: 'Language', subtitle: 'English (UK)', route: 'Language' },
    ],
    support: [
        { id: 'pm7', icon: 'help-circle', label: 'Help Center', route: 'Help' },
        { id: 'pm8', icon: 'log-out', label: 'Log Out', action: 'logout', color: 'error' },
    ],
};
