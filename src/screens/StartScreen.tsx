import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Button, Text, Surface, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function StartScreen() {
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <MaterialCommunityIcons name="map-marker-path" size={100} color={theme.colors.primary} style={styles.icon} />
                <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>Drive OS</Text>
                <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.secondary }]}>
                    Navigate the world freely. No boundaries.
                </Text>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('Auth')}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                    >
                        Get Started
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('Map')}
                        style={styles.button}
                    >
                        Explore Map
                    </Button>
                </View>
            </Animated.View>
        </Surface>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '80%',
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 1,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 40,
        opacity: 0.8,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 6,
    },
});
