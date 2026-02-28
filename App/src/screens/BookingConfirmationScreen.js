import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PrimaryButton, Card, Avatar } from '../components/common';
import useAppStore from '../store/useAppStore';
import { DRIVER_INFO } from '../data/mockData';
import { formatCurrency } from '../utils/helpers';

const BookingConfirmationScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { booking } = useAppStore();
    const [stage, setStage] = useState('searching'); // searching | found
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulse animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        );
        pulse.start();

        // Simulate driver found after 3 seconds
        const timer = setTimeout(() => {
            setStage('found');
            pulse.stop();
        }, 3000);

        return () => {
            clearTimeout(timer);
            pulse.stop();
        };
    }, []);

    const handleTrack = () => {
        navigation.navigate('RideTracking');
    };

    if (stage === 'searching') {
        return (
            <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
                <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
                <Animated.View style={[styles.searchCircle, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.searchCircleInner}>
                        <Ionicons name="car" size={40} color={COLORS.primary} />
                    </View>
                </Animated.View>
                <Text style={styles.searchTitle}>Finding your driver...</Text>
                <Text style={styles.searchSubtitle}>
                    We're matching you with the best driver nearby
                </Text>
                <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: SIZES.xl }} />

                {/* Progress dots */}
                <View style={styles.progressDots}>
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                </View>
            </View>
        );
    }

    const driver = DRIVER_INFO;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            <View style={styles.content}>
                {/* Success Icon */}
                <View style={styles.successCircle}>
                    <Ionicons name="checkmark" size={44} color={COLORS.white} />
                </View>
                <Text style={styles.successTitle}>Ride Confirmed!</Text>
                <Text style={styles.successSubtitle}>Your driver is on the way</Text>

                {/* Driver Card */}
                <Card style={styles.driverCard}>
                    <View style={styles.driverRow}>
                        <Avatar uri={driver.avatar} size={SIZES.avatarLg} />
                        <View style={styles.driverInfo}>
                            <Text style={styles.driverName}>{driver.name}</Text>
                            <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                            <View style={styles.driverMeta}>
                                <Ionicons name="star" size={14} color={COLORS.warning} />
                                <Text style={styles.driverRating}>{driver.rating}</Text>
                                <Text style={styles.driverPlate}>• {driver.plateNumber}</Text>
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Ride Summary */}
                <Card style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Ride Summary</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryDot}>
                            <Ionicons name="radio-button-on" size={14} color={COLORS.success} />
                        </View>
                        <View>
                            <Text style={styles.summaryLabel}>Pickup</Text>
                            <Text style={styles.summaryValue}>Current Location</Text>
                        </View>
                    </View>

                    <View style={styles.summaryLine} />

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryDot}>
                            <Ionicons name="location" size={14} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.summaryLabel}>Drop</Text>
                            <Text style={styles.summaryValue}>240 W 57th St, New York</Text>
                        </View>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.fareRow}>
                        <View style={styles.fareItem}>
                            <Text style={styles.fareLabel}>Vehicle</Text>
                            <Text style={styles.fareValue}>{booking.selectedVehicle?.name}</Text>
                        </View>
                        <View style={styles.fareItem}>
                            <Text style={styles.fareLabel}>ETA</Text>
                            <Text style={styles.fareValue}>5 mins</Text>
                        </View>
                        <View style={styles.fareItem}>
                            <Text style={styles.fareLabel}>Fare</Text>
                            <Text style={[styles.fareValue, { color: COLORS.primary }]}>
                                {formatCurrency(booking.fare)}
                            </Text>
                        </View>
                    </View>
                </Card>
            </View>

            {/* CTA */}
            <View style={styles.ctaContainer}>
                <PrimaryButton title="Track your ride →" onPress={handleTrack} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.xxl,
    },
    searchCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchCircleInner: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchTitle: {
        fontSize: SIZES.fontXl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginTop: SIZES.xl,
        textAlign: 'center',
    },
    searchSubtitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: SIZES.sm,
        textAlign: 'center',
    },
    progressDots: {
        flexDirection: 'row',
        gap: SIZES.sm,
        marginTop: SIZES.xxl,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
    },
    dotActive: {
        backgroundColor: COLORS.primary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: SIZES.lg,
        paddingTop: SIZES.xxxl,
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.success,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.lg,
    },
    successTitle: {
        fontSize: SIZES.fontXxl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginTop: SIZES.lg,
    },
    successSubtitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: SIZES.xs,
    },
    driverCard: {
        width: '100%',
        marginTop: SIZES.xl,
    },
    driverRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverInfo: {
        flex: 1,
        marginLeft: SIZES.md,
    },
    driverName: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    driverVehicle: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    driverMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    driverRating: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    driverPlate: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
    },
    summaryCard: {
        width: '100%',
        marginTop: SIZES.base,
    },
    summaryTitle: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
        marginBottom: SIZES.base,
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SIZES.md,
    },
    summaryDot: {
        marginTop: 2,
    },
    summaryLabel: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.medium,
        color: COLORS.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    summaryValue: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.medium,
        color: COLORS.text,
        marginTop: 2,
    },
    summaryLine: {
        width: 1,
        height: 20,
        backgroundColor: COLORS.border,
        marginLeft: 6,
        marginVertical: 4,
    },
    summaryDivider: {
        height: 1,
        backgroundColor: COLORS.borderLight,
        marginVertical: SIZES.md,
    },
    fareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fareItem: {
        alignItems: 'center',
    },
    fareLabel: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.regular,
        color: COLORS.textMuted,
    },
    fareValue: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
        marginTop: 2,
    },
    ctaContainer: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xl,
        paddingTop: SIZES.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
});

export default BookingConfirmationScreen;
