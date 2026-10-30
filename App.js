import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTable } from './database';
import CalendarScreen from './screens/CalendarScreen';
import TasksScreen from './screens/TasksScreen';
import TaskEditScreen from './screens/TaskEditScreen';
import MenuScreen from './screens/MenuScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function Root() {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
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
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.accent },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}>
        {user ? (
          <>
            <Stack.Screen
              name="Calendar"
              component={CalendarScreen}
              options={({ navigation }) => ({
                title: 'Календар',
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                    <Text style={{ fontSize: 24, color: colors.text }}>☰</Text>
                  </TouchableOpacity>
                ),
              })}/>
            <Stack.Screen name="Tasks" component={TasksScreen} options={{ title: 'Задачі' }} />
            <Stack.Screen name="TaskEdit" component={TaskEditScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Меню' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Вхід' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Реєстрація' }} />
          </>
        )}
      </Stack.Navigator>
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
