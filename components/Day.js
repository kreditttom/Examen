import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function Day({ day, isCurrentMonth, isToday, hasTasks, onPress }) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity style={styles.dayCell} onPress={onPress}>
            <Text
                style={[
                    styles.dayText,
                    { color: colors.text },
                    !isCurrentMonth && styles.dayTextMuted,
                    !isCurrentMonth && { color: colors.mutedText },
                    isToday && styles.dayTextToday,
                    isToday && { backgroundColor: colors.today, color: colors.todayText },
                ]}>
                {day}
            </Text>
            <View style={[styles.dot, { backgroundColor: hasTasks ? colors.dot : 'transparent' }]} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dayCell: {
        width: 50,
        paddingVertical: 10,
        alignItems: 'center',
    },
    dayText: {
        fontSize: 16,
    },
    dayTextMuted: {
        fontWeight: 'bold',
    },
    dayTextToday: {
        width: 28,
        height: 25,
        textAlign: 'center',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginTop: 3,
    },
});

export default Day;
