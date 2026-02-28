import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

export const PrimaryButton = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
    variant = 'primary', // primary | outline | ghost
    size = 'large', // small | medium | large
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';
    const isGhost = variant === 'ghost';

    const heights = { small: 40, medium: 46, large: SIZES.buttonHeight };
    const fontSizes = { small: SIZES.fontSm, medium: SIZES.fontBase, large: SIZES.fontMd };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.button,
                {
                    height: heights[size],
                    backgroundColor: isPrimary ? COLORS.primary : 'transparent',
                    borderWidth: isOutline ? 1.5 : 0,
                    borderColor: isOutline ? COLORS.primary : 'transparent',
                },
                isPrimary && SHADOWS.button,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? COLORS.white : COLORS.primary} />
            ) : (
                <View style={styles.buttonContent}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={SIZES.iconMd}
                            color={isPrimary ? COLORS.white : COLORS.primary}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                fontSize: fontSizes[size],
                                color: isPrimary ? COLORS.white : isGhost ? COLORS.textSecondary : COLORS.primary,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export const Card = ({ children, style, onPress }) => {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
        <Wrapper
            onPress={onPress}
            activeOpacity={onPress ? 0.9 : 1}
            style={[styles.card, style]}
        >
            {children}
        </Wrapper>
    );
};

export const Badge = ({ label, color = COLORS.primary, bgColor, style, size = 'small' }) => {
    const bg = bgColor || (color === COLORS.success ? COLORS.successBg : color === COLORS.error ? COLORS.errorBg : COLORS.primaryBg);
    const fontSizes = { small: SIZES.fontXs, medium: SIZES.fontSm };
    const paddings = { small: { paddingHorizontal: 8, paddingVertical: 3 }, medium: { paddingHorizontal: 10, paddingVertical: 4 } };
    return (
        <View style={[styles.badge, { backgroundColor: bg }, paddings[size], style]}>
            <Text style={[styles.badgeText, { color, fontSize: fontSizes[size] }]}>{label}</Text>
        </View>
    );
};

export const Avatar = ({ uri, size = SIZES.avatarMd, style }) => {
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, style]}>
            {uri ? (
                <View style={[styles.avatarInner, { width: size, height: size, borderRadius: size / 2, backgroundColor: COLORS.primaryBg }]}>
                    <Text style={{ fontSize: size * 0.4, color: COLORS.primary }}>
                        {String.fromCodePoint(0x1F464)}
                    </Text>
                </View>
            ) : (
                <View style={[styles.avatarInner, { width: size, height: size, borderRadius: size / 2, backgroundColor: COLORS.primaryBg }]}>
                    <Ionicons name="person" size={size * 0.5} color={COLORS.primary} />
                </View>
            )}
        </View>
    );
};

export const IconButton = ({ icon, onPress, size = 40, color = COLORS.text, bgColor = COLORS.surface, style }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                style,
            ]}
        >
            <Ionicons name={icon} size={size * 0.5} color={color} />
        </TouchableOpacity>
    );
};

export const Divider = ({ style }) => (
    <View style={[styles.divider, style]} />
);

export const SectionHeader = ({ title, actionText, onAction, style }) => (
    <View style={[styles.sectionHeader, style]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {actionText && (
            <TouchableOpacity onPress={onAction}>
                <Text style={styles.sectionAction}>{actionText}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    button: {
        borderRadius: SIZES.radiusMd,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.xl,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: FONTS.semiBold,
        letterSpacing: 0.3,
    },
    disabled: {
        opacity: 0.6,
    },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.base,
        ...SHADOWS.card,
    },
    badge: {
        borderRadius: SIZES.radiusFull,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontFamily: FONTS.semiBold,
        textTransform: 'uppercase',
    },
    avatar: {
        overflow: 'hidden',
    },
    avatarInner: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.borderLight,
        marginVertical: SIZES.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    sectionTitle: {
        fontSize: SIZES.fontLg,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    sectionAction: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.primary,
    },
});
