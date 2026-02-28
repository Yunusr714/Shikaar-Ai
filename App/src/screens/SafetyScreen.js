import React from 'react';
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
import { Card, Badge } from '../components/common';
import { SAFETY_FEATURES } from '../data/mockData';

const SafetyScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();

    const workflowSteps = [
        { label: 'Verify', icon: 'person-circle', color: COLORS.primary, done: true },
        { label: 'Monitor', icon: 'car', color: COLORS.primary, active: true },
        { label: 'Complete', icon: 'checkmark-circle', color: COLORS.border, done: false },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Safety Center</Text>
                <View style={styles.headerIndicator}>
                    <View style={styles.indicatorDot} />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Hero */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Your safety is</Text>
                    <Text style={styles.heroHighlight}>our priority</Text>
                    <Text style={styles.heroText}>
                        Shikaar uses AI to monitor your ride in real-time and ensure every trip meets our high safety standards.
                    </Text>
                </View>

                {/* Secure Ride Workflow */}
                <Card style={styles.workflowCard}>
                    <Text style={styles.workflowTitle}>SECURE RIDE WORKFLOW</Text>
                    <View style={styles.workflowRow}>
                        {workflowSteps.map((step, index) => (
                            <React.Fragment key={step.label}>
                                <View style={styles.workflowStep}>
                                    <View style={[
                                        styles.workflowIcon,
                                        step.active && styles.workflowIconActive,
                                        !step.done && !step.active && { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderWidth: 1 },
                                    ]}>
                                        <Ionicons
                                            name={step.icon}
                                            size={24}
                                            color={step.done || step.active ? COLORS.white : COLORS.textMuted}
                                        />
                                    </View>
                                    <Text style={[styles.workflowLabel, step.active && { color: COLORS.primary }]}>
                                        {step.label}
                                    </Text>
                                </View>
                                {index < workflowSteps.length - 1 && (
                                    <View style={[styles.workflowLine, step.done && { backgroundColor: COLORS.primary }]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </Card>

                {/* Safety Features */}
                <View style={styles.featuresHeader}>
                    <Text style={styles.featuresTitle}>Safety Features</Text>
                    <Badge label="Active Now" color={COLORS.success} bgColor={COLORS.successBg} />
                </View>

                <View style={styles.featuresGrid}>
                    {SAFETY_FEATURES.map((feature) => (
                        <TouchableOpacity key={feature.id} style={styles.featureCard} activeOpacity={0.8}>
                            <View style={[styles.featureIcon, {
                                backgroundColor:
                                    feature.icon === 'headset' ? COLORS.infoBg :
                                        feature.icon === 'locate' ? COLORS.successBg :
                                            feature.icon === 'warning' ? COLORS.errorBg :
                                                COLORS.primaryBg,
                            }]}>
                                <Ionicons
                                    name={feature.icon}
                                    size={22}
                                    color={
                                        feature.icon === 'headset' ? COLORS.info :
                                            feature.icon === 'locate' ? COLORS.success :
                                                feature.icon === 'warning' ? COLORS.error :
                                                    COLORS.primary
                                    }
                                />
                            </View>
                            <Text style={styles.featureName}>{feature.title}</Text>
                            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Trusted Contacts */}
                <TouchableOpacity style={styles.trustedCard} activeOpacity={0.8}>
                    <View style={styles.trustedRow}>
                        <View style={styles.trustedIcon}>
                            <Ionicons name="people" size={22} color={COLORS.white} />
                        </View>
                        <View style={styles.trustedContent}>
                            <Text style={styles.trustedTitle}>Add Trusted Contacts</Text>
                            <Text style={styles.trustedText}>
                                Automatically share ride details with friends & family.
                            </Text>
                        </View>
                        <View style={styles.trustedArrow}>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                        </View>
                    </View>
                </TouchableOpacity>

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
    headerIndicator: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
    },
    scrollContent: {
        paddingHorizontal: SIZES.base,
    },
    heroSection: {
        paddingVertical: SIZES.xl,
        paddingHorizontal: SIZES.xs,
    },
    heroTitle: {
        fontSize: SIZES.fontXxl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    heroHighlight: {
        fontSize: SIZES.fontXxl,
        fontFamily: FONTS.bold,
        color: COLORS.primary,
        marginBottom: SIZES.md,
    },
    heroText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    workflowCard: {
        marginBottom: SIZES.xl,
        paddingVertical: SIZES.xl,
    },
    workflowTitle: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.semiBold,
        color: COLORS.textMuted,
        letterSpacing: 1.2,
        textAlign: 'center',
        marginBottom: SIZES.xl,
    },
    workflowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    workflowStep: {
        alignItems: 'center',
    },
    workflowIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SIZES.sm,
    },
    workflowIconActive: {
        backgroundColor: COLORS.primary,
        ...SHADOWS.button,
    },
    workflowLabel: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
    },
    workflowLine: {
        width: 40,
        height: 2,
        backgroundColor: COLORS.border,
        marginHorizontal: SIZES.sm,
        marginBottom: SIZES.xl,
    },
    featuresHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.md,
    },
    featuresTitle: {
        fontSize: SIZES.fontLg,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SIZES.md,
        marginBottom: SIZES.lg,
    },
    featureCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.base,
        ...SHADOWS.sm,
    },
    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SIZES.sm,
    },
    featureName: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    featureSubtitle: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    trustedCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.lg,
        ...SHADOWS.md,
    },
    trustedRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trustedIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
    },
    trustedContent: {
        flex: 1,
    },
    trustedTitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.white,
    },
    trustedText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 18,
        marginTop: 2,
    },
    trustedArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SafetyScreen;
