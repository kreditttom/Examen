import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const MenuScreen = () => {
  const { isDark, colors, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={[styles.user, { color: colors.text }]}>Користувач: {user}</Text>

      <View style={[styles.row, { borderColor: colors.border }]}>
        <Text style={[styles.rowText, { color: colors.text }]}>Темна тема</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={logout}>
        <Text style={styles.btnText}>Вийти</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  user: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowText: {
    fontSize: 16,
  },
  btn: {
    padding: 14,
    alignItems: 'center',
    marginTop: 30,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default MenuScreen;
