import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { registerRequest, loginRequest } from '../../server/api/auth';

const AuthContext = createContext({
    user: null,
    token: null,
    loading: true,
    register: async () => null,
    login: async () => null,
    logout: async () => {},
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSaved = async () => {
            const savedToken = await AsyncStorage.getItem('token');
            const savedUser = await AsyncStorage.getItem('user');
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        loadSaved();
    }, []);

    const saveSession = async (data) => {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
    };

    const register = async (firstName, lastName, email, password) => {
        const result = await registerRequest(firstName, lastName, email, password);
        if (result.error) { return result.error; }
        await saveSession(result.data);
        return null;
    };

    const login = async (email, password) => {
        const result = await loginRequest(email, password);
        if (result.error) { return result.error; }
        await saveSession(result.data);
        return null;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() { return useContext(AuthContext);}