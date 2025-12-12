import React, { createContext, useContext, useState, useMemo } from 'react';
import { MD3LightTheme, MD3DarkTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

interface ThemeContextType {
    isMaterialYou: boolean;
    toggleMaterialYou: () => void;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isMaterialYou: false,
    toggleMaterialYou: () => { },
    isDark: false,
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMaterialYou, setIsMaterialYou] = useState(false);
    const [isDark, setIsDark] = useState(true); // Default to Dark mode for sleek look

    const toggleMaterialYou = () => setIsMaterialYou(!isMaterialYou);
    const toggleTheme = () => setIsDark(!isDark);

    const theme = useMemo(() => {
        // Basic custom palette logic - in a real Material You setup we'd fetch system colors.
        // For now, toggle between a "Standard" Blue and a "Material You" Greenish/Dynamic style
        const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
        const navTheme = isDark ? DarkTheme : LightTheme;

        const customColors = isMaterialYou ? {
            primary: '#d0bcff',
            secondary: '#ccc2dc',
            tertiary: '#efb8c8',
            background: '#1c1b1f',
            surface: '#1c1b1f',
        } : {
            // Standard "Drive OS" tech blue
            primary: '#4DA8DA',
            secondary: '#007CC7',
            tertiary: '#12232E',
            background: '#041d2e', // Deep Space Blue
            surface: '#0d2b42',
        };

        return {
            ...baseTheme,
            colors: {
                ...baseTheme.colors,
                ...customColors,
            },
        };
    }, [isDark, isMaterialYou]);

    return (
        <ThemeContext.Provider value={{ isMaterialYou, toggleMaterialYou, isDark, toggleTheme }}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={isDark ? DarkTheme : LightTheme}>
                    {children}
                </NavigationContainer>
            </PaperProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeSettings = () => useContext(ThemeContext);
