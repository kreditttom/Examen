import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (username.trim() === '' || password === '') {
      setError('Заповніть усі поля');
      return;
    }
    const result = await login(username.trim(), password);
    if (result) {
      setError(result);
    }
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
  ];

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyle}
        placeholder="Логін"
        placeholderTextColor={colors.mutedText}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"/>
      <TextInput
        style={inputStyle}
        placeholder="Пароль"
        placeholderTextColor={colors.mutedText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry/>

      {error !== '' && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.today }]} onPress={handleLogin}>
        <Text style={styles.btnText}>Увійти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, { color: colors.today }]}>Немає акаунта? Зареєструватись</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  error: {
    marginBottom: 12,
  },
  btn: {
    padding: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
