import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import TabNavigator from './TabNavigator';
import RideOptionsScreen from '../screens/RideOptionsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import BookingConfirmationScreen from '../screens/BookingConfirmationScreen';
import RideTrackingScreen from '../screens/RideTrackingScreen';

import RideHistoryScreen from '../screens/RideHistoryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    ...TransitionPresets.SlideFromRightIOS,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            >
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
