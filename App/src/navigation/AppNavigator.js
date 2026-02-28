import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RideOptionsScreen from '../screens/RideOptionsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import RideTrackingScreen from '../screens/RideTrackingScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen';

import useAppStore from '../store/useAppStore';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const isAuthenticated = useAppStore((state) => state.isAuthenticated);
    const authChecked = useAppStore((state) => state.authChecked);

    // Wait until we've checked AsyncStorage before rendering
    if (!authChecked) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            >
                {!isAuthenticated ? (
                    // Auth screens
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    // App screens
                    <>
                        <Stack.Screen name="Main" component={TabNavigator} />
                        <Stack.Screen name="RideOptions" component={RideOptionsScreen} />
                        <Stack.Screen name="Payment" component={PaymentScreen} />
                        <Stack.Screen
                            name="BookingConfirmation"
                            component={BookingConfirmationScreen}
                            options={{ gestureEnabled: false }}
                        />
                        <Stack.Screen name="RideTracking" component={RideTrackingScreen} />
                        <Stack.Screen name="RideHistory" component={RideHistoryScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
