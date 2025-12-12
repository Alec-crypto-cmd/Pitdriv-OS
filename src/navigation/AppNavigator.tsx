import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from '../screens/StartScreen';
import AuthScreen from '../screens/AuthScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { session, loading } = useAuth();

    if (loading) {
        // Return null or loading screen
        return null;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* If user is not logged in, they can still see Start and Map, but Map might prompt for login for features? 
          User said "use Supabase to upload location" which implies auth.
          Let's assume Start -> Auth -> Map flow or Start -> Map (Guest).
          User said "main feature is kart... upload location... authentication".
          I'll default to Start Screen.
      */}
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: 'Settings' }} />
        </Stack.Navigator>
    );
}
