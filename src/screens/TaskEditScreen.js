import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { insertTask, updateTask, deleteTask } from '../database';
import { formatDateKey } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const TaskEditScreen = ({ navigation, route }) => {
  const { date, task } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');

  useEffect(() => {
    navigation.setOptions({ title: task ? 'Редагування задачі' : 'Нова задача' }); }, []);

  const handleSave = async () => {
    if (title.trim() === '') {
      Alert.alert('Помилка', 'Введіть назву задачі');
      return;
    }

    if (task) {
      await updateTask(task.id, title.trim(), description.trim());
    } else {
      await insertTask(user, date, title.trim(), description.trim());
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Видалення', 'Видалити цю задачу?', [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const inputStyle = [
    styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.date, { color: colors.mutedText }]}>{formatDateKey(date)}</Text>

      <Text style={[styles.label, { color: colors.text }]}>Назва</Text>
      <TextInput
        style={inputStyle}
        value={title}
        onChangeText={setTitle}
        placeholder="Назва задачі"
        placeholderTextColor={colors.mutedText}/>

      <Text style={[styles.label, { color: colors.text }]}>Опис</Text>
      <TextInput
        style={[inputStyle, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Опис задачі"
        placeholderTextColor={colors.mutedText}
        multiline/>

      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.today }]} onPress={handleSave}>
        <Text style={styles.btnText}>Зберегти</Text>
      </TouchableOpacity>

      {task && (
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={handleDelete}>
          <Text style={styles.btnText}>Видалити</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  date: {
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },
  multiline: {
    height: 120,
    textAlignVertical: 'top',
  },
  btn: {
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default TaskEditScreen;
