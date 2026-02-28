import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PrimaryButton, Badge, IconButton } from '../components/common';
import MapPlaceholder from '../components/map/MapPlaceholder';
import { VEHICLE_OPTIONS } from '../data/mockData';
import useAppStore from '../store/useAppStore';
import { formatCurrency } from '../utils/helpers';

const RideOptionsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { booking, selectVehicle, selectedPayment } = useAppStore();
    const [selected, setSelected] = useState(booking.selectedVehicle?.id || 'v2');

    const handleSelect = (vehicle) => {
        setSelected(vehicle.id);
        selectVehicle(vehicle);
    };

    const handleConfirm = () => {
        navigation.navigate('Payment');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapPlaceholder
                    height={280}
                    showRoute
                    pickupLabel="Pickup"
                    dropLabel="Drop"
                    style={{ borderRadius: 0 }}
                />
                {/* Back button */}
                <TouchableOpacity
                    style={[styles.backBtn, { top: SIZES.sm }]}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                </TouchableOpacity>

                {/* More button */}
                <TouchableOpacity
                    style={[styles.moreBtn, { top: SIZES.sm }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
                    <Text style={styles.title}>Select Ride</Text>
                    <View style={styles.destinationRow}>
                        <Ionicons name="location" size={16} color={COLORS.primary} />
                        <Text style={styles.destinationText}>to 240 W 57th St, New York</Text>
                    </View>

                    {/* Vehicle Options */}
                    {VEHICLE_OPTIONS.map((vehicle) => (
                        <TouchableOpacity
                            key={vehicle.id}
                            style={[
                                styles.vehicleCard,
                                selected === vehicle.id && styles.vehicleCardSelected,
                            ]}
                            onPress={() => handleSelect(vehicle)}
                            activeOpacity={0.8}
                        >
                            {vehicle.badge && (
                                <Badge
                                    label={vehicle.badge}
                                    color={COLORS.primary}
                                    bgColor={COLORS.primaryBg}
                                    style={styles.vehicleBadge}
                                />
                            )}
                            <View style={styles.vehicleRow}>
                                <View style={styles.vehicleImageContainer}>
                                    <Text style={styles.vehicleEmoji}>{vehicle.image}</Text>
                                </View>
                                <View style={styles.vehicleInfo}>
                                    <Text style={styles.vehicleName}>{vehicle.name}</Text>
                                    <Text style={styles.vehicleMeta}>{vehicle.eta} • {vehicle.seats} seats</Text>
                                </View>
                                <View style={styles.vehicleRight}>
                                    <Text style={[styles.vehicleFare, selected === vehicle.id && { color: COLORS.primary }]}>
                                        {formatCurrency(vehicle.fare)}
                                    </Text>
                                    {selected === vehicle.id && (
                                        <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} style={{ marginTop: 4 }} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* Payment Method */}
                    <TouchableOpacity style={styles.paymentRow} onPress={() => navigation.navigate('Payment')}>
                        <View style={styles.paymentLeft}>
                            <View style={styles.paymentIcon}>
                                <Ionicons name="card" size={16} color={COLORS.textSecondary} />
                            </View>
                            <Text style={styles.paymentText}>Personal • **** {selectedPayment.last4}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                    </TouchableOpacity>
                </ScrollView>

                {/* CTA */}
                <View style={styles.ctaContainer}>
                    <PrimaryButton
                        title={`Confirm ${booking.selectedVehicle?.name || 'Shikaar Sedan'} →`}
                        onPress={handleConfirm}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapContainer: {
        position: 'relative',
    },
    backBtn: {
        position: 'absolute',
        left: SIZES.base,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    moreBtn: {
        position: 'absolute',
        right: SIZES.base,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radiusXl,
        borderTopRightRadius: SIZES.radiusXl,
        marginTop: -SIZES.lg,
        ...SHADOWS.lg,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.border,
        alignSelf: 'center',
        marginTop: SIZES.md,
        marginBottom: SIZES.md,
    },
    sheetContent: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xxl,
    },
    title: {
        fontSize: SIZES.fontXxl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginBottom: SIZES.xs,
    },
    destinationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.lg,
    },
    destinationText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginLeft: SIZES.xs,
    },
    vehicleCard: {
        borderWidth: 1.5,
        borderColor: COLORS.borderLight,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.base,
        marginBottom: SIZES.md,
        position: 'relative',
    },
    vehicleCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.surfaceAlt,
    },
    vehicleBadge: {
        position: 'absolute',
        top: -10,
        right: SIZES.base,
    },
    vehicleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleImageContainer: {
        width: 56,
        height: 48,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleEmoji: {
        fontSize: 28,
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: SIZES.md,
    },
    vehicleName: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    vehicleMeta: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    vehicleRight: {
        alignItems: 'flex-end',
    },
    vehicleFare: {
        fontSize: SIZES.fontLg,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SIZES.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.sm,
    },
    paymentText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
    },
    ctaContainer: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xl,
        paddingTop: SIZES.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
});

export default RideOptionsScreen;
