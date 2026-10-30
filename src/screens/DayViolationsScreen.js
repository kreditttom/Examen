import { StyleSheet, Text, View } from 'react-native';
import { formatDateKey } from '../utils/date';
import { useTheme } from '../context/ThemeContext';

const DayViolationsScreen = ({ route }) => {
    const { date } = route.params;
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{formatDateKey(date)}</Text>
            <Text style={{ color: colors.mutedText }}>  ---------   </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16
    },
});

export default DayViolationsScreen;