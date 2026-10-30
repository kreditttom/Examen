
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('currentUser').then((name) => {
            if (name) {
                setUser(name);
            }
            setLoading(false);
        });
    }, []);

    const register = async (username, password) => {
        const json = await AsyncStorage.getItem('users');
        const users = json ? JSON.parse(json) : [];

        const exists = users.find((u) => u.username === username);
        if (exists) {
            return 'Такий користувач вже існує';
        }

        users.push({ username, password });

        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('currentUser', username);

        setUser(username);
        return null;
    };

    const login = async (username, password) => {
        const json = await AsyncStorage.getItem('users');
        const users = json ? JSON.parse(json) : [];

        const found = users.find(
            (u) => u.username === username && u.password === password
        );

        if (!found) {
            return 'Невірний логін або пароль';
        }

        await AsyncStorage.setItem('currentUser', username);
        setUser(username);

        return null;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('currentUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
