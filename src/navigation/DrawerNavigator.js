import { StyleSheet, Switch, Text, View } from 'react-native';
import { createDrawerNavigator,  DrawerContentScrollView,  DrawerItem,  DrawerItemList, } from '@react-navigation/drawer';
import HomeStack from './HomeStack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    const { isDark, colors, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        props.navigation.navigate('Home');
        props.navigation.closeDrawer();
    };

    return (
        <DrawerContentScrollView {...props}>
            {user && (
                <Text style={[styles.user, { color: colors.text }]}>
                    {user.firstName} {user.lastName}
                </Text>
            )}

            <DrawerItemList {...props} />

            <View style={[styles.row, { borderColor: colors.border }]}>
                <Text style={{ color: colors.text, fontSize: 16 }}>Темна тема</Text>
                <Switch value={isDark} onValueChange={toggleTheme} />
            </View>

            {user && (
                <DrawerItem
                    label="Вийти"
                    labelStyle={{ color: colors.danger }}
                    onPress={handleLogout}
                />
            )}
        </DrawerContentScrollView>
    );
}

export default function DrawerNavigator() {
    const { colors } = useTheme();
    const { user } = useAuth();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: colors.accent },
                headerTintColor: colors.text,
                drawerStyle: { backgroundColor: colors.background },
                drawerActiveTintColor: colors.today,
                drawerInactiveTintColor: colors.text,
                sceneStyle: { backgroundColor: colors.background },}}>
            <Drawer.Screen
                name="Home"
                component={HomeStack}
                options={{ title: 'Головна', headerShown: false }}/>

            {!user && (
                <Drawer.Screen name="SignIn" component={LoginScreen} options={{ title: 'Увійти' }} />
            )}
            {!user && (
                <Drawer.Screen name="SignUp" component={RegisterScreen} options={{ title: 'Реєстрація' }} />
            )}
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    user: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginVertical: 8,
    },
});