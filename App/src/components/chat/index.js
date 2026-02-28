import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

export const ChatBubble = ({ message, isUser }) => {
    return (
        <View style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
            {!isUser && (
                <View style={styles.botAvatar}>
                    <Ionicons name="sparkles" size={16} color={COLORS.primary} />
                </View>
            )}
            <View style={{ flex: 1, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                {!isUser && <Text style={styles.senderName}>Shikaar AI</Text>}
                {isUser && <Text style={styles.senderNameUser}>You</Text>}
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
                    <Text style={[styles.bubbleText, isUser && styles.userText]}>{message.text}</Text>
                    {message.steps && (
                        <View style={styles.stepsContainer}>
                            {message.steps.map((step, index) => (
                                <View key={index} style={styles.stepItem}>
                                    <View style={[styles.stepIcon, { backgroundColor: index === 0 ? COLORS.primaryBg : index === 1 ? '#EBF5FF' : '#F0FFF4' }]}>
                                        <Ionicons
                                            name={step.icon === 'location' ? 'location' : step.icon === 'flag' ? 'flag' : step.icon === 'car' ? 'car' : step.icon === 'radar' ? 'radio' : step.icon === 'star' ? 'star' : step.icon === 'flash' ? 'flash' : step.icon === 'time' ? 'time' : step.icon === 'cash' ? 'cash' : step.icon === 'shield' || step.icon === 'shield-checkmark' ? 'shield-checkmark' : step.icon === 'alert-circle' ? 'alert-circle' : step.icon === 'call' ? 'call' : 'ellipse'}
                                            size={16}
                                            color={index === 0 ? COLORS.primary : index === 1 ? COLORS.info : COLORS.success}
                                        />
                                    </View>
                                    <View style={styles.stepContent}>
                                        <Text style={styles.stepTitle}>{step.title}</Text>
                                        <Text style={styles.stepDescription}>{step.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
                {!isUser && message.steps && (
                    <View style={styles.feedbackRow}>
                        <Text style={styles.feedbackText}>Did this help?</Text>
                        <TouchableOpacity style={styles.feedbackBtn}>
                            <Ionicons name="thumbs-up-outline" size={16} color={COLORS.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.feedbackBtn}>
                            <Ionicons name="thumbs-down-outline" size={16} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {isUser && (
                <View style={styles.userAvatar}>
                    <Ionicons name="person" size={14} color={COLORS.success} />
                </View>
            )}
        </View>
    );
};

export const TypingIndicator = () => {
    return (
        <View style={styles.typingWrapper}>
            <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={16} color={COLORS.primary} />
            </View>
            <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                </View>
            </View>
        </View>
    );
};

export const QuickSuggestion = ({ label, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.suggestion} activeOpacity={0.7}>
            <Text style={styles.suggestionText}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bubbleWrapper: {
        flexDirection: 'row',
        marginBottom: SIZES.base,
        paddingHorizontal: SIZES.base,
        alignItems: 'flex-start',
    },
    userWrapper: {
        justifyContent: 'flex-end',
    },
    botWrapper: {
        justifyContent: 'flex-start',
    },
    botAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primaryBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginTop: 20,
    },
    userAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.successBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        marginTop: 20,
    },
    senderName: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    senderNameUser: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
        marginBottom: 4,
        textAlign: 'right',
    },
    bubble: {
        maxWidth: '90%',
        borderRadius: SIZES.radiusMd,
        padding: SIZES.base,
    },
    userBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: COLORS.white,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    bubbleText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.text,
        lineHeight: 20,
    },
    userText: {
        color: COLORS.white,
    },
    stepsContainer: {
        marginTop: SIZES.md,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: SIZES.md,
        alignItems: 'flex-start',
    },
    stepIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SIZES.sm,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
        marginBottom: 2,
    },
    stepDescription: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        lineHeight: 18,
    },
    feedbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        paddingLeft: 4,
    },
    feedbackText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.regular,
        color: COLORS.textMuted,
        marginRight: 8,
    },
    feedbackBtn: {
        padding: 4,
        marginHorizontal: 2,
    },
    typingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SIZES.base,
        marginBottom: SIZES.base,
    },
    typingBubble: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radiusMd,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.md,
    },
    typingDots: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.textMuted,
        marginHorizontal: 3,
    },
    dot1: { opacity: 0.4 },
    dot2: { opacity: 0.6 },
    dot3: { opacity: 0.8 },
    suggestion: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radiusFull,
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.sm,
        marginRight: SIZES.sm,
    },
    suggestionText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.medium,
        color: COLORS.text,
    },
});
