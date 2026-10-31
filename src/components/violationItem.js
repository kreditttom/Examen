import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ViolationItem({ violation, onPress }) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                {violation.description}
            </Text>
            <Text style={[styles.author, { color: colors.mutedText }]}>
                {violation.firstName} {violation.lastName}
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
    author: {
        fontSize: 13,
        marginTop: 4,
    },
});

export default ViolationItem;