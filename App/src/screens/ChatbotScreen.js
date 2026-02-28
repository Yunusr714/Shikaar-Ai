import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { ChatBubble, TypingIndicator, QuickSuggestion } from '../components/chat';
import { QUICK_SUGGESTIONS } from '../data/mockData';
import useAppStore from '../store/useAppStore';

const ChatbotScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    const chatMessages = useAppStore((state) => state.chatMessages);
    const isBotTyping = useAppStore((state) => state.isBotTyping);
    const sendChatMessage = useAppStore((state) => state.sendChatMessage);

    useEffect(() => {
        if (flatListRef.current && chatMessages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [chatMessages, isBotTyping]);

    const handleSend = () => {
        if (inputText.trim()) {
            sendChatMessage(inputText.trim());
            setInputText('');
        }
    };

    const handleSuggestion = (text) => {
        sendChatMessage(text);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.botAvatarSmall}>
                        <Ionicons name="chatbubbles" size={16} color={COLORS.white} />
                    </View>
                </View>
                <Text style={styles.headerTitle}>Shikaar AI Guide</Text>
                <TouchableOpacity style={styles.moreBtn}>
                    <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Date Pill */}
            <View style={styles.datePill}>
                <Text style={styles.datePillText}>Today</Text>
            </View>

            {/* Chat Messages */}
            <FlatList
                ref={flatListRef}
                data={chatMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatBubble message={item} isUser={item.type === 'user'} />
                )}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={isBotTyping ? <TypingIndicator /> : null}
            />

            {/* Quick Suggestions - horizontal scroll */}
            <View style={styles.suggestionsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestionsContainer}
                >
                    {QUICK_SUGGESTIONS.map((item) => (
                        <QuickSuggestion
                            key={item}
                            label={item}
                            onPress={() => handleSuggestion(item)}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ask anything about Shikaar..."
                        placeholderTextColor={COLORS.textMuted}
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={handleSend}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, inputText.trim() && styles.sendBtnActive]}
                        onPress={handleSend}
                        disabled={!inputText.trim()}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="send"
                            size={18}
                            color={inputText.trim() ? COLORS.white : COLORS.textMuted}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    headerLeft: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botAvatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: SIZES.fontMd,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
    },
    moreBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    datePill: {
        alignSelf: 'center',
        backgroundColor: COLORS.border,
        borderRadius: SIZES.radiusFull,
        paddingHorizontal: SIZES.md,
        paddingVertical: SIZES.xs,
        marginVertical: SIZES.md,
    },
    datePillText: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.medium,
        color: COLORS.textSecondary,
    },
    chatList: {
        paddingVertical: SIZES.sm,
        flexGrow: 1,
    },
    suggestionsWrapper: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    suggestionsContainer: {
        paddingHorizontal: SIZES.base,
        paddingVertical: SIZES.sm,
    },
    inputContainer: {
        paddingHorizontal: SIZES.base,
        paddingTop: SIZES.sm,
        paddingBottom: SIZES.md,
        backgroundColor: COLORS.white,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusFull,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingLeft: SIZES.base,
        paddingRight: SIZES.xs,
        height: 48,
    },
    input: {
        flex: 1,
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.text,
    },
    sendBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnActive: {
        backgroundColor: COLORS.primary,
    },
});

export default ChatbotScreen;
