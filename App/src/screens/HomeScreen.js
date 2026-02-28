import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    StatusBar,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { Card, Badge, SectionHeader, Avatar, IconButton } from '../components/common';
import { SAVED_PLACES, SPECIAL_OFFERS, RECENT_RIDES, TOP_DESTINATIONS } from '../data/mockData';
import { getGreeting } from '../utils/helpers';
import useAppStore from '../store/useAppStore';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const user = useAppStore((state) => state.user);
    const [searchFocused, setSearchFocused] = useState(false);

    const handleSearch = () => {
        navigation.navigate('RideOptions');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Avatar uri={user.avatar} size={SIZES.avatarMd} />
                        <View style={styles.headerInfo}>
                            <Text style={styles.greeting}>{getGreeting()},</Text>
                            <Text style={styles.userName}>{user.name}</Text>
                        </View>
                    </View>
                    <IconButton
                        icon="notifications-outline"
                        onPress={() => { }}
                        bgColor={COLORS.surface}
                        color={COLORS.text}
                    />
                </View>

                {/* Search Card */}
                <Card style={styles.searchCard} onPress={handleSearch}>
                    <Text style={styles.searchTitle}>Where to?</Text>
                    <TouchableOpacity style={styles.searchBar} onPress={handleSearch} activeOpacity={0.8}>
                        <Ionicons name="search" size={20} color={COLORS.textMuted} />
                        <Text style={styles.searchPlaceholder}>Search destination</Text>
                        <View style={styles.searchFilter}>
                            <Ionicons name="options-outline" size={18} color={COLORS.text} />
                        </View>
                    </TouchableOpacity>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        {SAVED_PLACES.map((place) => (
                            <TouchableOpacity key={place.id} style={styles.quickAction} activeOpacity={0.7} onPress={handleSearch}>
                                <View style={[styles.quickIcon, { backgroundColor: place.label === 'Home' ? COLORS.primaryBg : place.label === 'Work' ? COLORS.infoBg : COLORS.warningBg }]}>
                                    <Ionicons
                                        name={place.icon === 'home' ? 'home' : place.icon === 'briefcase' ? 'briefcase' : 'star'}
                                        size={14}
                                        color={place.label === 'Home' ? COLORS.primary : place.label === 'Work' ? COLORS.info : COLORS.warning}
                                    />
                                </View>
                                <Text style={styles.quickLabel}>{place.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                {/* Special Offers */}
                <SectionHeader title="Special Offers" actionText="See All" onAction={() => { }} />
                <FlatList
                    horizontal
                    data={SPECIAL_OFFERS}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.offerList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.offerCard, { backgroundColor: item.bgColor }]}
                            activeOpacity={0.9}
                        >
                            {item.tag && (
                                <Badge
                                    label={item.tag}
                                    color={COLORS.white}
                                    bgColor={item.id === 'offer1' ? COLORS.primary : COLORS.success}
                                    style={styles.offerBadge}
                                />
                            )}
                            <Text style={[styles.offerTitle, { color: item.textColor }]}>{item.title}</Text>
                            {item.subtitle && (
                                <Text style={[styles.offerSubtitle, { color: item.textColor }]}>{item.subtitle}</Text>
                            )}
                            {item.code && (
                                <TouchableOpacity style={styles.offerCodeRow}>
                                    <Text style={styles.offerCode}>Use code {item.code}</Text>
                                    <Ionicons name="arrow-forward" size={14} color={COLORS.white} />
                                </TouchableOpacity>
                            )}
                            {item.action && (
                                <Text style={styles.offerAction}>{item.action}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />

                {/* Recent Activity */}
                <SectionHeader title="Recent Activity" style={{ marginTop: SIZES.xl }} />
                {RECENT_RIDES.map((ride) => (
                    <Card key={ride.id} style={styles.rideCard} onPress={handleSearch}>
                        <View style={styles.rideRow}>
                            <View style={styles.rideIcon}>
                                <Ionicons name="car" size={18} color={COLORS.textSecondary} />
                            </View>
                            <View style={styles.rideInfo}>
                                <Text style={styles.rideDrop}>{ride.drop}</Text>
                                <Text style={styles.rideDate}>{ride.date}</Text>
                            </View>
                            <View style={styles.rideRight}>
                                <Text style={styles.rideFare}>{ride.fare}</Text>
                                <TouchableOpacity>
                                    <Text style={styles.rebook}>Rebook <Ionicons name="refresh" size={12} color={COLORS.primary} /></Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Card>
                ))}

                {/* Top Destinations */}
                <SectionHeader title="Top Destinations" style={{ marginTop: SIZES.xl }} />
                <View style={styles.destinationGrid}>
                    {TOP_DESTINATIONS.slice(0, 2).map((dest) => (
                        <TouchableOpacity key={dest.id} style={styles.destCard} activeOpacity={0.8} onPress={handleSearch}>
                            <View style={styles.destImage}>
                                <Ionicons name="map" size={28} color={COLORS.primary} />
                            </View>
                            <Text style={styles.destName}>{dest.name}</Text>
                            <Text style={styles.destInfo}>{dest.time} • {dest.fare}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: SIZES.xxxl }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: SIZES.base,
        paddingBottom: SIZES.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.base,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerInfo: {
        marginLeft: SIZES.md,
    },
    greeting: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
    },
    userName: {
        fontSize: SIZES.fontLg,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    searchCard: {
        marginVertical: SIZES.base,
        padding: SIZES.lg,
    },
    searchTitle: {
        fontSize: SIZES.fontXxl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginBottom: SIZES.md,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusFull,
        paddingHorizontal: SIZES.base,
        height: SIZES.inputHeight,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    searchPlaceholder: {
        flex: 1,
        marginLeft: SIZES.sm,
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textMuted,
    },
    searchFilter: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    quickActions: {
        flexDirection: 'row',
        marginTop: SIZES.base,
        gap: SIZES.sm,
    },
    quickAction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusFull,
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.sm,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    quickIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    quickLabel: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.text,
    },
    offerList: {
        paddingRight: SIZES.base,
    },
    offerCard: {
        width: width * 0.55,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.lg,
        marginRight: SIZES.md,
        minHeight: 150,
        justifyContent: 'flex-end',
    },
    offerBadge: {
        marginBottom: SIZES.sm,
    },
    offerTitle: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.bold,
        lineHeight: 22,
        marginBottom: SIZES.xs,
    },
    offerSubtitle: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        opacity: 0.8,
        marginBottom: SIZES.sm,
    },
    offerCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.sm,
    },
    offerCode: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.white,
        marginRight: 6,
    },
    offerAction: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.primary,
    },
    rideCard: {
        marginBottom: SIZES.sm,
    },
    rideRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rideIcon: {
        width: 44,
        height: 44,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rideInfo: {
        flex: 1,
        marginLeft: SIZES.md,
    },
    rideDrop: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    rideDate: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    rideRight: {
        alignItems: 'flex-end',
    },
    rideFare: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    rebook: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.primary,
        marginTop: 2,
    },
    destinationGrid: {
        flexDirection: 'row',
        gap: SIZES.md,
    },
    destCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.md,
        alignItems: 'center',
    },
    destImage: {
        width: '100%',
        height: 80,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SIZES.sm,
    },
    destName: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
        textAlign: 'center',
    },
    destInfo: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
});

export default HomeScreen;
