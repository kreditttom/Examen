import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function TaskItem({ task, onPress }) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {task.title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 14,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
    },
});

export default TaskItem;
