import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../../theme';

/**
 * Strip markdown-style formatting and clean up raw LLM output.
 * Also catches raw JSON that leaks through to the display.
 */
const cleanText = (raw) => {
    if (!raw) return '';
    let text = raw;

    // If the text looks like raw JSON, try to extract the answer field
    if (text.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(text.trim());
            if (parsed && parsed.answer) {
                text = typeof parsed.answer === 'string' ? parsed.answer : JSON.stringify(parsed.answer);
            }
        } catch {
            // not valid JSON, continue with cleaning
        }
    }

    // Remove bold / italic markers
    text = text.replace(/\*\*(.+?)\*\*/g, '$1');
    text = text.replace(/__(.+?)__/g, '$1');
    // Convert markdown - bullets to •
    text = text.replace(/^\s*[-]\s+/gm, '• ');
    // Convert numbered lists to •
    text = text.replace(/^\s*\d+[.)]\s+/gm, '• ');
    // Remove markdown headers
    text = text.replace(/^#{1,6}\s+/gm, '');
    // Remove horizontal rules
    text = text.replace(/^[-*_]{3,}\s*$/gm, '');
    // Collapse multiple newlines
    text = text.replace(/\n{3,}/g, '\n\n');
    // Trim whitespace
    text = text.trim();
    return text;
};

/**
 * Typewriter text component — reveals text word by word.
 */
const TypewriterText = ({ text, style, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const wordsRef = useRef([]);
    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        wordsRef.current = text.split(/(\s+)/); // split but keep whitespace
        indexRef.current = 0;
        setDisplayedText('');
        setIsComplete(false);

        intervalRef.current = setInterval(() => {
            if (indexRef.current < wordsRef.current.length) {
                const nextChunk = wordsRef.current.slice(0, indexRef.current + 1).join('');
                setDisplayedText(nextChunk);
                indexRef.current += 1;
            } else {
                clearInterval(intervalRef.current);
                setIsComplete(true);
                onComplete?.();
            }
        }, 30);

        return () => clearInterval(intervalRef.current);
    }, [text]);

    return <Text style={style}>{displayedText}{!isComplete ? '▍' : ''}</Text>;
};

/**
 * Animated step card — fades in with a delay.
 */
const AnimatedStepItem = ({ step, index, delay }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }, delay);

        return () => clearTimeout(timeout);
    }, [delay]);

    const iconColors = [COLORS.primary, COLORS.info || '#3B82F6', COLORS.success || '#22C55E', '#F59E0B', '#8B5CF6'];
    const bgColors = [COLORS.primaryBg || '#FFF5F0', '#EBF5FF', '#F0FFF4', '#FFFBEB', '#F5F3FF'];
    const colorIndex = index % iconColors.length;

    return (
        <Animated.View
            style={[
                styles.stepItem,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
        >
            <View style={[styles.stepIcon, { backgroundColor: bgColors[colorIndex] }]}>
                <Ionicons
                    name={
                        step.icon === 'location' ? 'location' :
                        step.icon === 'flag' ? 'flag' :
                        step.icon === 'car' ? 'car' :
                        step.icon === 'radio' ? 'radio' :
                        step.icon === 'star' ? 'star' :
                        step.icon === 'flash' ? 'flash' :
                        step.icon === 'time' ? 'time' :
                        step.icon === 'cash' ? 'cash' :
                        step.icon === 'shield-checkmark' ? 'shield-checkmark' :
                        step.icon === 'alert-circle' ? 'alert-circle' :
                        step.icon === 'call' ? 'call' :
                        step.icon === 'navigate' ? 'navigate' :
                        step.icon === 'search' ? 'search' :
                        step.icon === 'person' ? 'person' :
                        step.icon === 'checkmark-circle' ? 'checkmark-circle' :
                        step.icon === 'card' ? 'card' :
                        step.icon === 'map' ? 'map' :
                        'ellipse'
                    }
                    size={16}
                    color={iconColors[colorIndex]}
                />
            </View>
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
        </Animated.View>
    );
};

export const ChatBubble = ({ message, isUser }) => {
    const cleaned = isUser ? message.text : cleanText(message.text);
    const isNewBotMsg = !isUser && message._animate;
    const [textDone, setTextDone] = useState(!isNewBotMsg); // start as done for non-animated

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
                    {isNewBotMsg ? (
                        <TypewriterText
                            text={cleaned}
                            style={[styles.bubbleText]}
                            onComplete={() => setTextDone(true)}
                        />
                    ) : (
                        <Text style={[styles.bubbleText, isUser && styles.userText]}>{cleaned}</Text>
                    )}
                    {/* Steps: show only after text animation completes */}
                    {message.steps && textDone && (
                        <View style={styles.stepsContainer}>
                            {message.steps.map((step, index) => (
                                <AnimatedStepItem
                                    key={index}
                                    step={step}
                                    index={index}
                                    delay={index * 200} /* stagger each step by 200ms */
                                />
                            ))}
                        </View>
                    )}
                </View>
                {!isUser && message.steps && textDone && (
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
        lineHeight: 22,
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
