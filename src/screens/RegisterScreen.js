import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === '' || password === '') {
      setError('Заповніть усі поля');
      return;
    }
    if (password !== password2) {
      setError('Паролі не збігаються');
      return;
    }
    const result = await register(
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        password
    );
    if (result) {
      setError(result);
    }
  };

  const inputStyle = [
    styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }, ];

  return (
      <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: colors.text }]}>Реєстрація</Text>
        <TextInput
            style={inputStyle}
            placeholder="Ім'я"
            placeholderTextColor={colors.mutedText}
            value={firstName}
            onChangeText={setFirstName}/>
        <TextInput
            style={inputStyle}
            placeholder="Прізвище"
            placeholderTextColor={colors.mutedText}
            value={lastName}
            onChangeText={setLastName}/>
        <TextInput
            style={inputStyle}
            placeholder="Email"
            placeholderTextColor={colors.mutedText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"/>
        <TextInput
            style={inputStyle}
            placeholder="Пароль (мінімум 6 символів)"
            placeholderTextColor={colors.mutedText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry/>
        <TextInput
            style={inputStyle}
            placeholder="Повторіть пароль"
            placeholderTextColor={colors.mutedText}
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry/>

        {error !== '' && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.today }]} onPress={handleRegister}>
          <Text style={styles.btnText}>Зареєструватись</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={[styles.link, { color: colors.today }]}>Вже є акаунт? Увійти</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    marginBottom: 12,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
  },
});


export default RegisterScreen;