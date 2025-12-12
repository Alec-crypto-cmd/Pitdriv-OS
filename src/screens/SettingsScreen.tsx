import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, List, Text, Surface, useTheme, Divider } from 'react-native-paper';
import { useThemeSettings } from '../context/ThemeContext';

export default function SettingsScreen() {
    const theme = useTheme();
    const { isMaterialYou, toggleMaterialYou, isDark, toggleTheme } = useThemeSettings();

    return (
        <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium" style={[styles.header, { color: theme.colors.primary }]}>Settings</Text>

            <List.Section>
                <List.Subheader>Appearance</List.Subheader>
                <List.Item
                    title="Material You Design"
                    description="Use dynamic color palette"
                    left={props => <List.Icon {...props} icon="palette" />}
                    right={() => <Switch value={isMaterialYou} onValueChange={toggleMaterialYou} />}
                />
                <Divider />
                <List.Item
                    title="Dark Mode"
                    description="Toggle dark/light theme"
                    left={props => <List.Icon {...props} icon="theme-light-dark" />}
                    right={() => <Switch value={isDark} onValueChange={toggleTheme} />}
                />
            </List.Section>
        </Surface>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
        fontWeight: 'bold',
    },
});
