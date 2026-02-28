import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { Card, Avatar, Badge } from '../components/common';
import { PROFILE_MENU } from '../data/mockData';
import useAppStore from '../store/useAppStore';

const ProfileScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const user = useAppStore((state) => state.user);
    const [notifications, setNotifications] = React.useState(true);

    const handleMenuPress = (item) => {
        if (item.route === 'RideHistory') {
            navigation.navigate('RideHistory');
        }
    };

    const renderMenuItem = (item) => (
        <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIcon, item.color === 'error' && { backgroundColor: COLORS.errorBg }]}>
                <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color === 'error' ? COLORS.error : COLORS.primary}
                />
            </View>
            <View style={styles.menuContent}>
                <Text style={[styles.menuLabel, item.color === 'error' && { color: COLORS.error }]}>
                    {item.label}
                </Text>
                {item.subtitle && <Text style={styles.menuSub}>{item.subtitle}</Text>}
            </View>
            {item.toggle ? (
                <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                    trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
                    thumbColor={notifications ? COLORS.primary : COLORS.white}
                />
            ) : (
                !item.action && <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="settings-outline" size={22} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Avatar uri={user.avatar} size={SIZES.avatarXl} />
                        <TouchableOpacity style={styles.editAvatar}>
                            <Ionicons name="camera" size={14} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={styles.memberRow}>
                        <Ionicons name="diamond" size={14} color={COLORS.success} />
                        <Text style={styles.memberText}>{user.membershipTier}</Text>
                    </View>
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={14} color={COLORS.textSecondary} />
                        <Text style={styles.locationText}>{user.location}</Text>
                    </View>
                </View>

                {/* Premium Banner */}
                <Card style={styles.premiumCard}>
                    <View style={styles.premiumRow}>
                        <View style={styles.premiumContent}>
                            <View style={styles.premiumIconRow}>
                                <Ionicons name="diamond" size={18} color={COLORS.white} />
                                <Text style={styles.premiumTitle}>Shikaar Premium</Text>
                            </View>
                            <Text style={styles.premiumText}>
                                Unlock exclusive rides, priority{'\n'}support, and free cancellations.
                            </Text>
                            <TouchableOpacity style={styles.premiumBtn}>
                                <Text style={styles.premiumBtnText}>View Benefits</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.premiumGraphic}>
                            <View style={styles.premiumIcon}>
                                <Ionicons name="rocket" size={32} color={COLORS.primary} />
                            </View>
                        </View>
                    </View>
                </Card>

                {/* Account Settings */}
                <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
                <Card style={styles.menuCard}>
                    {PROFILE_MENU.accountSettings.map(renderMenuItem)}
                </Card>

                {/* Preferences */}
                <Text style={styles.sectionTitle}>PREFERENCES</Text>
                <Card style={styles.menuCard}>
                    {PROFILE_MENU.preferences.map(renderMenuItem)}
                </Card>

                {/* Support */}
                <Text style={styles.sectionTitle}>SUPPORT</Text>
                <Card style={styles.menuCard}>
                    {PROFILE_MENU.support.map(renderMenuItem)}
                </Card>

                {/* Version */}
                <Text style={styles.version}>Shikaar App v4.2.0</Text>

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
    scrollContent: {
        paddingHorizontal: SIZES.base,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: SIZES.xl,
        backgroundColor: COLORS.white,
        marginTop: SIZES.sm,
        borderRadius: SIZES.radiusMd,
        ...SHADOWS.sm,
    },
    avatarContainer: {
        position: 'relative',
    },
    editAvatar: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    userName: {
        fontSize: SIZES.fontXl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginTop: SIZES.md,
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.xs,
        gap: 4,
    },
    memberText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.success,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SIZES.xs,
        gap: 4,
    },
    locationText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
    },
    premiumCard: {
        backgroundColor: COLORS.surfaceAlt,
        marginTop: SIZES.base,
        borderWidth: 1,
        borderColor: '#FFD4C0',
    },
    premiumRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    premiumContent: {
        flex: 1,
    },
    premiumIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
        marginBottom: SIZES.xs,
    },
    premiumTitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    premiumText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        lineHeight: 18,
        marginBottom: SIZES.md,
    },
    premiumBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radiusFull,
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.sm,
        alignSelf: 'flex-start',
    },
    premiumBtnText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
    },
    premiumGraphic: {
        width: 70,
        height: 70,
        marginLeft: SIZES.md,
    },
    premiumIcon: {
        width: 70,
        height: 70,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.semiBold,
        color: COLORS.textMuted,
        letterSpacing: 1.2,
        marginTop: SIZES.xl,
        marginBottom: SIZES.sm,
        marginLeft: SIZES.xs,
    },
    menuCard: {
        padding: 0,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.medium,
        color: COLORS.text,
    },
    menuSub: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    version: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SIZES.xl,
    },
});

export default ProfileScreen;
