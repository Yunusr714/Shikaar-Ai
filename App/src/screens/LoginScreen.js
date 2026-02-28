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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';
import { PrimaryButton } from '../components/common';
import { loginUser } from '../services/auth';
import useAppStore from '../store/useAppStore';

const LoginScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const setAuth = useAppStore((state) => state.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Validation', 'Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const data = await loginUser(email.trim(), password);
            setAuth(data.access_token, { id: data.user_id, name: data.name, email: email.trim() });
        } catch (err) {
            const message = err?.response?.data?.detail || 'Login failed. Please try again.';
            Alert.alert('Login Error', message);
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
                {/* Logo / Brand */}
                <View style={styles.brandSection}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="car-sport" size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.brandName}>Shikaar</Text>
                    <Text style={styles.brandTagline}>Your ride, your way</Text>
                </View>

                {/* Form */}
                <View style={styles.formSection}>
                    <Text style={styles.formTitle}>Welcome Back</Text>
                    <Text style={styles.formSubtitle}>Sign in to continue your journey</Text>

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

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputRow}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
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

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotRow}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <PrimaryButton
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.loginBtn}
                    />

                    {/* Register Link */}
                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>Sign Up</Text>
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
    brandSection: {
        alignItems: 'center',
        paddingTop: SIZES.xxxl,
        paddingBottom: SIZES.xxl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.button,
    },
    brandName: {
        fontSize: SIZES.fontDisplay,
        fontFamily: FONTS.bold,
        color: COLORS.text,
        marginTop: SIZES.base,
    },
    brandTagline: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
        marginTop: SIZES.xs,
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
    forgotRow: {
        alignSelf: 'flex-end',
        marginBottom: SIZES.xl,
    },
    forgotText: {
        fontSize: SIZES.fontSm,
        fontFamily: FONTS.semiBold,
        color: COLORS.primary,
    },
    loginBtn: {
        marginBottom: SIZES.lg,
    },
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerText: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.regular,
        color: COLORS.textSecondary,
    },
    registerLink: {
        fontSize: SIZES.fontBase,
        fontFamily: FONTS.bold,
        color: COLORS.primary,
    },
});

export default LoginScreen;
