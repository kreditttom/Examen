import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TaskItem from '../components/taskItem';
import { fetchTasksByDate } from '../database';
import { formatDateKey } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const TasksScreen = ({ navigation, route }) => {
  const { date } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchTasksByDate(user, date).then(setTasks);
    }, [user, date])
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{formatDateKey(date)}</Text>

      {tasks.length === 0 ? (
        <Text style={[styles.empty, { color: colors.mutedText }]}>На цей день задач немає</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onPress={() => navigation.navigate('TaskEdit', { date, task: item })}/>
          )}
        />
      )}

      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.today }]}
        onPress={() => navigation.navigate('TaskEdit', { date })}>
        <Text style={styles.addBtnText}>+ Додати задачу</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    flex: 1,
  },
  addBtn: {
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default TasksScreen;
