import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import SafetyScreen from '../screens/SafetyScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBarWrapper}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel || route.name;
                    const isFocused = state.index === index;
                    const isChatbot = route.name === 'ChatbotTab';

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Center chatbot button - floating FAB style
                    if (isChatbot) {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={styles.chatbotTabItem}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.chatbotButton, isFocused && styles.chatbotButtonActive]}>
                                    <Ionicons
                                        name="chatbubbles"
                                        size={26}
                                        color={COLORS.white}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    }

                    let iconName;
                    switch (route.name) {
                        case 'HomeTab':
                            iconName = isFocused ? 'home' : 'home-outline';
                            break;
                        case 'ActivityTab':
                            iconName = isFocused ? 'time' : 'time-outline';
                            break;
                        case 'SafetyTab':
                            iconName = isFocused ? 'shield-checkmark' : 'shield-checkmark-outline';
                            break;
                        case 'ProfileTab':
                            iconName = isFocused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'ellipse';
                    }

                    const isSafety = route.name === 'SafetyTab';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.tabIconContainer, isFocused && styles.tabIconActive]}>
                                <Ionicons
                                    name={iconName}
                                    size={22}
                                    color={isFocused ? COLORS.primary : COLORS.textMuted}
                                />
                                {isSafety && (
                                    <View style={styles.notificationDot} />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.tabLabel,
                                    { color: isFocused ? COLORS.primary : COLORS.textMuted },
                                    isFocused && { fontFamily: FONTS.semiBold },
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="ActivityTab"
                component={RideHistoryScreen}
                options={{ tabBarLabel: 'Activity' }}
            />
            <Tab.Screen
                name="ChatbotTab"
                component={ChatbotScreen}
                options={{ tabBarLabel: 'AI Guide' }}
            />
            <Tab.Screen
                name="SafetyTab"
                component={SafetyScreen}
                options={{ tabBarLabel: 'Safety' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Account' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBarWrapper: {
        backgroundColor: 'transparent',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
        paddingTop: SIZES.sm,
        paddingBottom: Platform.OS === 'ios' ? SIZES.xl : SIZES.md,
        paddingHorizontal: SIZES.base,
        alignItems: 'flex-end',
        ...SHADOWS.sm,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    chatbotTabItem: {
        flex: 1,
        alignItems: 'center',
        marginTop: -28,
    },
    chatbotButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 4,
        borderColor: COLORS.white,
    },
    chatbotButtonActive: {
        backgroundColor: COLORS.primaryDark,
        shadowOpacity: 0.5,
    },
    tabIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    tabIconActive: {
        backgroundColor: COLORS.primaryBg,
    },
    tabLabel: {
        fontSize: SIZES.fontXs,
        fontFamily: FONTS.medium,
        marginTop: 2,
    },
    notificationDot: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
});

export default TabNavigator;
