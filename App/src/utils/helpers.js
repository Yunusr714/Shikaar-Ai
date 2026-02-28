export const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
};

export const formatDate = (date) => {
    const d = new Date(date);
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return d.toLocaleDateString('en-US', options);
};

export const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

export const truncateText = (text, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return '#10B981';
        case 'cancelled':
            return '#EF4444';
        case 'ongoing':
            return '#F59E0B';
        case 'scheduled':
            return '#3B82F6';
        default:
            return '#6B7280';
    }
};

export const getStatusIcon = (status) => {
    switch (status) {
        case 'completed':
            return 'checkmark-circle';
        case 'cancelled':
            return 'close-circle';
        case 'ongoing':
            return 'timer';
        case 'scheduled':
            return 'time';
        default:
            return 'ellipse';
    }
};
