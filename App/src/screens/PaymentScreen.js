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
import { PrimaryButton, Card, Badge } from '../components/common';
import { PAYMENT_METHODS } from '../data/mockData';
import useAppStore from '../store/useAppStore';
import { formatCurrency } from '../utils/helpers';

const PaymentScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { booking, selectedPayment, setSelectedPayment } = useAppStore();
    const [selected, setSelected] = useState(selectedPayment.id);

    const totalFare = booking.fare + 6.50; // base + fees

    const handleSelect = (method) => {
        setSelected(method.id);
        setSelectedPayment(method);
    };

    const handlePay = () => {
        navigation.navigate('BookingConfirmation');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
                <View style={{ width: 42 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Total Amount */}
                <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>Total to pay</Text>
                    <Text style={styles.amountValue}>{formatCurrency(totalFare)}</Text>
                </View>

                {/* AI Assistant Suggestion */}
                <Card style={styles.aiCard}>
                    <View style={styles.aiRow}>
                        <View style={styles.aiIcon}>
                            <Ionicons name="sparkles" size={18} color={COLORS.white} />
                        </View>
                        <View style={styles.aiContent}>
                            <Text style={styles.aiTitle}>Shikaar AI Assistant</Text>
                            <Text style={styles.aiText}>
                                I've selected your preferred card ending in {selectedPayment.last4} for faster checkout. You can change this below.
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Saved Cards */}
                <Text style={styles.sectionTitle}>SAVED CARDS</Text>
                {PAYMENT_METHODS.cards.map((card) => (
                    <TouchableOpacity
                        key={card.id}
                        style={[styles.paymentOption, selected === card.id && styles.paymentOptionSelected]}
                        onPress={() => handleSelect(card)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.paymentIconBox, { backgroundColor: card.type === 'visa' ? '#1A1F71' : '#EB001B' }]}>
                            <Ionicons name="card" size={16} color={COLORS.white} />
                        </View>
                        <View style={styles.paymentInfo}>
                            <View style={styles.paymentLabelRow}>
                                <Text style={styles.paymentLabel}>{card.label}</Text>
                                {card.isDefault && (
                                    <Badge label="DEFAULT" color={COLORS.success} size="small" />
                                )}
                            </View>
                            <Text style={styles.paymentSub}>**** {card.last4}</Text>
                        </View>
                        <View style={[styles.radio, selected === card.id && styles.radioSelected]}>
                            {selected === card.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Add New Card */}
                <TouchableOpacity style={styles.addCard} activeOpacity={0.7}>
                    <Ionicons name="add" size={20} color={COLORS.textSecondary} />
                    <Text style={styles.addCardText}>Add new card</Text>
                </TouchableOpacity>

                {/* UPI */}
                <Text style={styles.sectionTitle}>UPI</Text>
                {PAYMENT_METHODS.upi.map((upi) => (
                    <TouchableOpacity
                        key={upi.id}
                        style={[styles.paymentOption, selected === upi.id && styles.paymentOptionSelected]}
                        onPress={() => handleSelect(upi)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.paymentIconBox, { backgroundColor: upi.type === 'gpay' ? '#4285F4' : '#5F259F' }]}>
                            <Ionicons name={upi.type === 'gpay' ? 'logo-google' : 'phone-portrait'} size={16} color={COLORS.white} />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentLabel}>{upi.label}</Text>
                            <Text style={styles.paymentSub}>{upi.subtitle}</Text>
                        </View>
                        <View style={[styles.radio, selected === upi.id && styles.radioSelected]}>
                            {selected === upi.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* More Options */}
                <Text style={styles.sectionTitle}>MORE OPTIONS</Text>
                {PAYMENT_METHODS.other.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[styles.paymentOption, selected === method.id && styles.paymentOptionSelected]}
                        onPress={() => handleSelect(method)}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.paymentIconBox, { backgroundColor: COLORS.success }]}>
                            <Ionicons name="cash" size={16} color={COLORS.white} />
                        </View>
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentLabel}>{method.label}</Text>
                            <Text style={styles.paymentSub}>{method.subtitle}</Text>
                        </View>
                        <View style={[styles.radio, selected === method.id && styles.radioSelected]}>
                            {selected === method.id && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Secure Payment */}
                <View style={styles.secureRow}>
                    <Ionicons name="shield-checkmark" size={16} color={COLORS.error} />
                    <Text style={styles.secureText}>Secure Payment</Text>
                </View>

                <View style={{ height: SIZES.xxl }} />
            </ScrollView>

            {/* CTA */}
            <View style={styles.ctaContainer}>
                <PrimaryButton
                    title={`Pay ${formatCurrency(totalFare)} & Book Ride`}
                    onPress={handlePay}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.md,
    },
    backBtn: {
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
        paddingHorizontal: SIZES.lg,
    },
    amountSection: {
        alignItems: 'center',
        paddingVertical: SIZES.lg,
    },
    amountLabel: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
    },
    amountValue: {
        fontSize: SIZES.fontDisplay,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginTop: SIZES.xs,
    },
    aiCard: {
        backgroundColor: COLORS.surfaceAlt,
        marginBottom: SIZES.xl,
        borderWidth: 0,
    },
    aiRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    aiIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
    },
    aiContent: {
        flex: 1,
    },
    aiTitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
        marginBottom: 4,
    },
    aiText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    sectionTitle: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.semiBold,
        color: COLORS.textMuted,
        letterSpacing: 1.2,
        marginBottom: SIZES.md,
        marginTop: SIZES.lg,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.base,
        marginBottom: SIZES.sm,
        borderWidth: 1.5,
        borderColor: COLORS.borderLight,
    },
    paymentOptionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.surfaceAlt,
    },
    paymentIconBox: {
        width: 40,
        height: 40,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.md,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.sm,
    },
    paymentLabel: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    paymentSub: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    addCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        padding: SIZES.base,
        marginBottom: SIZES.sm,
        borderWidth: 1.5,
        borderColor: COLORS.borderLight,
        borderStyle: 'dashed',
    },
    addCardText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        marginLeft: SIZES.sm,
    },
    secureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SIZES.lg,
    },
    secureText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        marginLeft: SIZES.xs,
    },
    ctaContainer: {
        paddingHorizontal: SIZES.lg,
        paddingBottom: SIZES.xl,
        paddingTop: SIZES.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        backgroundColor: COLORS.white,
    },
});

export default PaymentScreen;
