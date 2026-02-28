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
import { Card, Badge, PrimaryButton } from '../components/common';
import { RIDE_HISTORY } from '../data/mockData';
import { getStatusColor, getStatusIcon } from '../utils/helpers';

const FILTERS = ['All', 'Completed', 'Scheduled'];

const RideHistoryScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('All');

    const filteredRides = activeFilter === 'All'
        ? RIDE_HISTORY
        : RIDE_HISTORY.filter((r) => r.status === activeFilter.toLowerCase());

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Ride History</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="options-outline" size={22} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filterRow}>
                {FILTERS.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                        onPress={() => setActiveFilter(filter)}
                        activeOpacity={0.7}
                    >
                        {activeFilter === filter && (
                            <Ionicons
                                name={filter === 'All' ? 'checkmark-circle' : filter === 'Completed' ? 'checkmark-circle' : 'time'}
                                size={14}
                                color={COLORS.white}
                                style={{ marginRight: 4 }}
                            />
                        )}
                        {activeFilter !== filter && (
                            <Ionicons
                                name={filter === 'All' ? 'list' : filter === 'Completed' ? 'checkmark-circle-outline' : 'time-outline'}
                                size={14}
                                color={COLORS.textSecondary}
                                style={{ marginRight: 4 }}
                            />
                        )}
                        <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Ride Insights */}
                <Card style={styles.insightCard}>
                    <View style={styles.insightRow}>
                        <View style={styles.insightIcon}>
                            <Ionicons name="sparkles" size={18} color={COLORS.primary} />
                        </View>
                        <View style={styles.insightContent}>
                            <Text style={styles.insightTitle}>Ride Insights</Text>
                            <Text style={styles.insightText}>
                                You've saved $45 this month by riding during off-peak hours. Keep it up!
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Rides List */}
                {filteredRides.map((ride) => (
                    <Card key={ride.id} style={styles.rideCard}>
                        {/* Status and date */}
                        <View style={styles.rideHeader}>
                            <Badge
                                label={ride.status === 'completed' ? '✓ Completed' : ride.status === 'cancelled' ? '✕ Cancelled' : ride.status}
                                color={getStatusColor(ride.status)}
                                bgColor={ride.status === 'completed' ? COLORS.successBg : COLORS.errorBg}
                            />
                            <Text style={styles.rideDate}>{ride.date}</Text>
                            <Text style={[styles.rideFare, ride.status === 'cancelled' && styles.fareCancelled]}>
                                {ride.fare}
                            </Text>
                        </View>

                        <View style={styles.rideBody}>
                            {/* Map thumbnail */}
                            <View style={styles.mapThumb}>
                                <Ionicons name="map" size={24} color={COLORS.primary} />
                            </View>

                            {/* Route */}
                            <View style={styles.routeInfo}>
                                <View style={styles.routeRow}>
                                    <View style={[styles.routeDot, { backgroundColor: COLORS.textMuted }]} />
                                    <Text style={styles.routeText}>{ride.pickup}</Text>
                                </View>
                                <View style={styles.routeRow}>
                                    <View style={[styles.routeDot, { backgroundColor: COLORS.primary }]} />
                                    <Text style={styles.routeText}>{ride.drop}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.rideActions}>
                            <TouchableOpacity style={styles.invoiceBtn} activeOpacity={0.7}>
                                <Ionicons name="document-text-outline" size={14} color={COLORS.textSecondary} />
                                <Text style={styles.invoiceBtnText}>Invoice</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rebookBtn}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('RideOptions')}
                            >
                                <Ionicons name="refresh" size={14} color={COLORS.white} />
                                <Text style={styles.rebookBtnText}>Rebook</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                ))}

                <View style={{ height: SIZES.xxxl }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.md,
        backgroundColor: COLORS.white,
    },
    headerBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.md,
        gap: SIZES.sm,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.sm,
        borderRadius: SIZES.radiusFull,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
    },
    filterTextActive: {
        color: COLORS.white,
    },
    scrollContent: {
        paddingHorizontal: SIZES.base,
        paddingTop: SIZES.md,
    },
    insightCard: {
        backgroundColor: COLORS.surfaceAlt,
        marginBottom: SIZES.base,
        borderWidth: 1,
        borderColor: '#FFE8DB',
    },
    insightRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    insightIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
    },
    insightContent: {
        flex: 1,
    },
    insightTitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    insightText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        lineHeight: 18,
        marginTop: 2,
    },
    rideCard: {
        marginBottom: SIZES.md,
    },
    rideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    rideDate: {
        flex: 1,
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginLeft: SIZES.sm,
    },
    rideFare: {
        fontSize: SIZES.fontLg,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    fareCancelled: {
        color: COLORS.textMuted,
        textDecorationLine: 'line-through',
    },
    rideBody: {
        flexDirection: 'row',
        marginBottom: SIZES.md,
    },
    mapThumb: {
        width: 64,
        height: 64,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
    },
    routeInfo: {
        flex: 1,
        justifyContent: 'center',
        gap: SIZES.sm,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    routeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    routeText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.medium,
        color: COLORS.text,
    },
    rideActions: {
        flexDirection: 'row',
        gap: SIZES.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        paddingTop: SIZES.md,
    },
    invoiceBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
        borderRadius: SIZES.radiusSm,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 4,
    },
    invoiceBtnText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
    },
    rebookBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
        borderRadius: SIZES.radiusSm,
        backgroundColor: COLORS.primary,
        gap: 4,
    },
    rebookBtnText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
    },
});

export default RideHistoryScreen;
