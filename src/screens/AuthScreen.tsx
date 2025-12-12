import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { supabase } from '../services/supabase';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    async function handleAuth() {
        setLoading(true);
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) Alert.alert('Error', error.message);
            else {
                // Navigation handled by auth listener if setup globally or just navigate
                navigation.navigate('Map');
            }
        } else {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) Alert.alert('Error', error.message);
            else Alert.alert('Success', 'Check your email for confirmation!');
        }
        setLoading(false);
    }

    return (
        <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.form}>
                <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.primary }]}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    mode="outlined"
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    mode="outlined"
                />

                <Button
                    mode="contained"
                    onPress={handleAuth}
                    loading={loading}
                    style={styles.button}
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>

                <Button
                    mode="text"
                    onPress={() => setIsLogin(!isLogin)}
                    style={styles.switchButton}
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </Button>
            </View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    form: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
    switchButton: {
        marginTop: 15,
    },
});
