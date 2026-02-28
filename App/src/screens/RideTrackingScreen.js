import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PrimaryButton, Card, Badge, Avatar } from '../components/common';
import MapPlaceholder from '../components/map/MapPlaceholder';
import useAppStore from '../store/useAppStore';
import { DRIVER_INFO } from '../data/mockData';

const RideTrackingScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { booking, updateRideStatus } = useAppStore();
    const [currentStatus, setCurrentStatus] = useState('arriving');
    const [eta, setEta] = useState('2 mins');
    const [distance, setDistance] = useState('0.5 km');

    const driver = DRIVER_INFO;

    const statusSteps = [
        { label: 'Searching', icon: 'search', done: true },
        { label: 'Driver Assigned', icon: 'person', done: true },
        { label: 'Arriving', icon: 'car', done: true, active: true },
        { label: 'Trip Started', icon: 'navigate', done: false },
        { label: 'Completed', icon: 'checkmark-circle', done: false },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Map Area */}
            <View style={styles.mapContainer}>
                <MapPlaceholder
                    height={380}
                    showRoute
                    pickupLabel="Pickup"
                    dropLabel="Drop"
                    driverLabel={driver.plateNumber}
                    style={{ borderRadius: 0 }}
                />

                {/* Back button */}
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                </TouchableOpacity>

                {/* Status banner */}
                <View style={styles.statusBanner}>
                    <Text style={styles.statusText}>Arriving in {eta}</Text>
                </View>

                {/* Driver icon on map */}
                <View style={styles.driverMarkerIcon}>
                    <Ionicons name="headset" size={16} color={COLORS.white} />
                </View>

                {/* Zoom controls */}
                <View style={styles.zoomControls}>
                    <TouchableOpacity style={styles.zoomBtn}>
                        <Ionicons name="add" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.zoomBtn}>
                        <Ionicons name="remove" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* My location */}
                <TouchableOpacity style={styles.myLocationBtn}>
                    <Ionicons name="locate" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.handle} />

                {/* Meeting point */}
                <View style={styles.meetingSection}>
                    <View>
                        <Text style={styles.meetingTitle}>Meet at Pickup Point</Text>
                        <Text style={styles.meetingSubtitle}>Driver is {eta} away • {distance}</Text>
                    </View>
                    <Badge label="ON TIME" color={COLORS.primary} bgColor={COLORS.primaryBg} />
                </View>

                {/* Driver Card */}
                <Card style={styles.driverCard}>
                    <View style={styles.driverRow}>
                        <Avatar uri={driver.avatar} size={SIZES.avatarLg} />
                        <View style={styles.driverInfo}>
                            <Text style={styles.driverName}>{driver.name}</Text>
                            <Text style={styles.driverVehicle}>{driver.vehicle}</Text>
                            <View style={styles.driverMeta}>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>{driver.rating}</Text>
                                    <Ionicons name="star" size={10} color={COLORS.warning} />
                                </View>
                                <View style={styles.plateBadge}>
                                    <Text style={styles.plateText}>{driver.plateNumber}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.driverActions}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <Ionicons name="chatbubble-ellipses" size={18} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
                                <Ionicons name="call" size={18} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card>

                {/* Safety Buttons */}
                <View style={styles.safetyRow}>
                    <TouchableOpacity style={styles.sosBtn} activeOpacity={0.8}>
                        <Ionicons name="radio" size={18} color={COLORS.error} />
                        <Text style={styles.sosBtnText}>SOS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
                        <Ionicons name="locate" size={18} color={COLORS.white} />
                        <Text style={styles.shareBtnText}>Share Trip</Text>
                    </TouchableOpacity>
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
        flex: 1,
    },
    backBtn: {
        position: 'absolute',
        top: SIZES.sm,
        left: SIZES.base,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    statusBanner: {
        position: 'absolute',
        top: SIZES.sm,
        alignSelf: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusFull,
        paddingHorizontal: SIZES.lg,
        paddingVertical: SIZES.sm,
        ...SHADOWS.md,
    },
    statusText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    driverMarkerIcon: {
        position: 'absolute',
        top: SIZES.sm,
        right: SIZES.base,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomControls: {
        position: 'absolute',
        right: SIZES.base,
        top: '40%',
        gap: SIZES.xs,
    },
    zoomBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    myLocationBtn: {
        position: 'absolute',
        right: SIZES.base,
        bottom: SIZES.xxl,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    bottomSheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: SIZES.radiusXl,
        borderTopRightRadius: SIZES.radiusXl,
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xl,
        ...SHADOWS.lg,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.border,
        alignSelf: 'center',
        marginTop: SIZES.md,
        marginBottom: SIZES.base,
    },
    meetingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SIZES.base,
    },
    meetingTitle: {
        fontSize: SIZES.fontLg,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    meetingSubtitle: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    driverCard: {
        marginBottom: SIZES.base,
        borderWidth: 0,
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
        marginTop: SIZES.xs,
        gap: SIZES.sm,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warningBg,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 3,
    },
    ratingText: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    plateBadge: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    plateText: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.medium,
        color: COLORS.text,
        letterSpacing: 0.5,
    },
    driverActions: {
        flexDirection: 'row',
        gap: SIZES.sm,
    },
    actionBtn: {
        width: 42,
        height: 42,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtnPrimary: {
        backgroundColor: COLORS.primary,
    },
    safetyRow: {
        flexDirection: 'row',
        gap: SIZES.md,
    },
    sosBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: SIZES.radiusMd,
        backgroundColor: COLORS.errorBg,
        borderWidth: 1,
        borderColor: COLORS.error,
        gap: SIZES.sm,
    },
    sosBtnText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.bold,
        color: COLORS.error,
    },
    shareBtn: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderRadius: SIZES.radiusMd,
        backgroundColor: COLORS.primary,
        gap: SIZES.sm,
    },
    shareBtnText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.bold,
        color: COLORS.white,
    },
});

export default RideTrackingScreen;
