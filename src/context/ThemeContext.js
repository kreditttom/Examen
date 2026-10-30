
import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../utils/colors';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('theme').then((value) => {
            if (value === 'dark') {
                setIsDark(true);
            }
        });
    }, []);

    const toggleTheme = () => {
        const newValue = !isDark;

        setIsDark(newValue);
        AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
    };

    const colors = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
