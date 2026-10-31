import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function ViolationItem({ violation, onPress = () => {} }) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.item, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
            onPress={onPress}>
            {violation.url && <Image source={{ uri: violation.url }} style={styles.photo} />}

            <View style={styles.body}>
                <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
                    {violation.description}
                </Text>

                <View style={styles.row}>
                    <Text style={[styles.meta, { color: colors.mutedText }]}>
                        {violation.firstName} {violation.lastName}
                    </Text>
                    {violation.time && (
                        <Text style={[styles.meta, { color: colors.mutedText }]}>{violation.time}</Text>
                    )}
                </View>

                {violation.pending && (
                    <Text style={[styles.pending, { color: colors.danger }]}>
                        Не відправлено на сервер
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        borderRadius: 14,
        marginBottom: 14,
        overflow: 'hidden',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    photo: {
        width: '100%',
        height: 180,
    },
    body: {
        padding: 14,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    meta: {
        fontSize: 13,
    },
    pending: {
        fontSize: 13,
        marginTop: 8,
        fontWeight: '600',
    },
});

export default ViolationItem;