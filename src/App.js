import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTable } from './database';
import DrawerNavigator from './navigation/DrawerNavigator';

function Root() {
    const { colors } = useTheme();
    const { loading } = useAuth();
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        createTable().then(() => setDbReady(true));
    }, []);

    if (loading || !dbReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    );
}

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Root />
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;