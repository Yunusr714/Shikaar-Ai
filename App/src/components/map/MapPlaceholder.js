import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../theme';

const MapPlaceholder = ({
    height = 300,
    showRoute = false,
    pickupLabel = 'Pickup',
    dropLabel = 'Drop',
    driverLabel,
    style,
}) => {
    return (
        <View style={[styles.container, { height }, style]}>
            {/* Map grid pattern */}
            <View style={styles.gridContainer}>
                {Array.from({ length: 8 }).map((_, row) => (
                    <View key={row} style={styles.gridRow}>
                        {Array.from({ length: 6 }).map((_, col) => (
                            <View
                                key={col}
                                style={[
                                    styles.gridCell,
                                    (row + col) % 3 === 0 && styles.gridCellHighlight,
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>

            {/* Road lines */}
            <View style={styles.roadHorizontal} />
            <View style={styles.roadVertical} />

            {/* Pickup marker */}
            <View style={[styles.marker, styles.pickupMarker]}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
                <View style={styles.markerLabel}>
                    <Text style={styles.markerText}>{pickupLabel}</Text>
                </View>
            </View>

            {/* Drop marker */}
            {showRoute && (
                <>
                    <View style={[styles.marker, styles.dropMarker]}>
                        <Ionicons name="location" size={20} color={COLORS.error} />
                        <View style={[styles.markerLabel, { backgroundColor: COLORS.secondary }]}>
                            <Text style={[styles.markerText, { color: COLORS.white }]}>{dropLabel}</Text>
                        </View>
                    </View>

                    {/* Route line */}
                    <View style={styles.routeLine} />
                </>
            )}

            {/* Driver marker */}
            {driverLabel && (
                <View style={[styles.marker, styles.driverMarker]}>
                    <View style={styles.driverIcon}>
                        <Ionicons name="car" size={16} color={COLORS.white} />
                    </View>
                    <View style={[styles.markerLabel, { backgroundColor: COLORS.secondary }]}>
                        <Text style={[styles.markerText, { color: COLORS.white, fontSize: 9 }]}>{driverLabel}</Text>
                    </View>
                </View>
            )}

            {/* Distance badge */}
            {showRoute && (
                <View style={styles.distanceBadge}>
                    <Text style={styles.distanceText}>12 min (4.2 km)</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#EDF2F7',
        borderRadius: SIZES.radius,
        overflow: 'hidden',
        position: 'relative',
    },
    gridContainer: {
        flex: 1,
        padding: 8,
    },
    gridRow: {
        flexDirection: 'row',
        flex: 1,
    },
    gridCell: {
        flex: 1,
        margin: 1,
        backgroundColor: '#E2E8F0',
        borderRadius: 2,
    },
    gridCellHighlight: {
        backgroundColor: '#D5DDE6',
    },
    roadHorizontal: {
        position: 'absolute',
        top: '45%',
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#CBD5E0',
    },
    roadVertical: {
        position: 'absolute',
        left: '35%',
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: '#CBD5E0',
    },
    marker: {
        position: 'absolute',
        alignItems: 'center',
    },
    pickupMarker: {
        top: '30%',
        left: '25%',
    },
    dropMarker: {
        bottom: '25%',
        right: '20%',
    },
    driverMarker: {
        top: '50%',
        left: '45%',
    },
    driverIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerLabel: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    markerText: {
        fontSize: 10,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    routeLine: {
        position: 'absolute',
        top: '35%',
        left: '30%',
        width: '40%',
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
        transform: [{ rotate: '35deg' }],
    },
    distanceBadge: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: SIZES.radiusFull,
    },
    distanceText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
    },
});

export default MapPlaceholder;
