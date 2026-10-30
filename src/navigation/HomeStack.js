import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import DayViolationsScreen from '../screens/DayViolationsScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
    const { colors } = useTheme();

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: colors.accent },
                headerTintColor: colors.text,
                contentStyle: { backgroundColor: colors.background },
            }}>
            <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen
                name="DayViolations"
                component={DayViolationsScreen}
                options={{ title: 'Правопорушення' }}/>
        </Stack.Navigator>
    );
}