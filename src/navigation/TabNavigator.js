import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CalendarScreen from '../screens/CalendarScreen';
import MapScreen from '../screens/MapScreen';
import AddViolationScreen from '../screens/AddViolationScreen';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    const { colors } = useTheme();
    const { user } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: { backgroundColor: colors.accent },
                headerTintColor: colors.text,
                tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
                tabBarActiveTintColor: colors.today,
                tabBarInactiveTintColor: colors.mutedText,
                sceneStyle: { backgroundColor: colors.background },
                headerLeft: () => (
                    <TouchableOpacity
                        style={{ marginLeft: 15 }}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <Ionicons name="menu" size={26} color={colors.text} />
                    </TouchableOpacity>
                ),
            })}>
            <Tab.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                    title: 'Календар',
                    tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Map"
                component={MapScreen}
                options={{
                    title: 'Мапа правопорушень',
                    tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
                }}
            />
            {user && (
                <Tab.Screen
                    name="AddViolation"
                    component={AddViolationScreen}
                    options={{
                        title: 'Додати',
                        tabBarIcon: ({ color, size }) => <Ionicons name="camera" size={size} color={color} />,
                    }}
                />
            )}
        </Tab.Navigator>
    );
}