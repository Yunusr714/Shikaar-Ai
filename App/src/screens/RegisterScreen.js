import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PrimaryButton } from '../components/common';
import { registerUser } from '../services/auth';
import useAppStore from '../store/useAppStore';

const RegisterScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const setAuth = useAppStore((state) => state.setAuth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Validation', 'Please fill in name, email, and password');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Validation', 'Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const data = await registerUser(name.trim(), email.trim(), phone.trim(), password);
            setAuth(data.access_token, { id: data.user_id, name: data.name, email: email.trim() });
        } catch (err) {
            const message = err?.response?.data?.detail || 'Registration failed. Please try again.';
            Alert.alert('Registration Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { paddingTop: insets.top }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Brand */}
                <View style={styles.brandSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="car-sport" size={32} color={COLORS.white} />
                    </View>
                </View>

                {/* Form */}
                <View style={styles.formSection}>
                    <Text style={styles.formTitle}>Create Account</Text>
                    <Text style={styles.formSubtitle}>Join Shikaar for smart rides</Text>

                    {/* Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor={COLORS.textMuted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor={COLORS.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone (optional)</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="call-outline" size={20} color={COLORS.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="+91 XXXXX XXXXX"
                                placeholderTextColor={COLORS.textMuted}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="At least 6 characters"
                                placeholderTextColor={COLORS.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={COLORS.textMuted}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Register Button */}
                    <PrimaryButton
                        title="Create Account"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.registerBtn}
                    />

                    {/* Login Link */}
                    <View style={styles.loginRow}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SIZES.xl,
        paddingBottom: SIZES.xxl,
    },
    headerRow: {
        paddingVertical: SIZES.sm,
    },
    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandSection: {
        alignItems: 'center',
        paddingBottom: SIZES.xl,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.button,
    },
    formSection: {
        flex: 1,
    },
    formTitle: {
        fontSize: SIZES.fontXxl,
        fontFamily: FONTS.bold,
        color: COLORS.text,
    },
    formSubtitle: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: SIZES.xs,
        marginBottom: SIZES.xl,
    },
    inputGroup: {
        marginBottom: SIZES.base,
    },
    inputLabel: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.text,
        marginBottom: SIZES.sm,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.radiusMd,
        paddingHorizontal: SIZES.base,
        height: SIZES.inputHeight,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    input: {
        flex: 1,
        marginLeft: SIZES.sm,
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.text,
    },
    registerBtn: {
        marginTop: SIZES.lg,
        marginBottom: SIZES.lg,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
    },
    loginLink: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.bold,
        color: COLORS.primary,
    },
});

export default RegisterScreen;
