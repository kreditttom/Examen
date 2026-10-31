import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ViolationItem from '../components/violationItem';
import { fetchByDateRequest } from '../../server/api/violations';
import { formatDateKey } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import { fetchUnsyncedByDate } from '../database';

const DayViolationsScreen = ({ route }) => {
    const { date } = route.params;
    const { colors } = useTheme();
    const [violations, setViolations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                setLoading(true);
                const localRows = await fetchUnsyncedByDate(date);

                const local = localRows.map((row) => ({
                    ...row,
                    firstName: 'Ви',
                    lastName: '',
                    pending: true,
                }));

                const result = await fetchByDateRequest(date);
                if (result.error) {
                    setError(result.error);
                    setViolations(local);
                } else {
                    setError('');
                    setViolations([...result.data, ...local]);
                }setLoading(false);
            };
            load();
        }, [date])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>{formatDateKey(date)}</Text>

            {error !== '' && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

            {violations.length === 0 && error === '' ? (
                <Text style={[styles.empty, { color: colors.mutedText }]}>
                    На цей день правопорушень немає
                </Text>
            ) : (
                <FlatList
                    data={violations}
                    keyExtractor={(item) => (item.pending ? 'local-' : 'server-') + item.id}
                    renderItem={({ item }) => <ViolationItem violation={item} />}/>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    center: { flex: 1, justifyContent: 'center' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    error: { marginBottom: 12 },
    empty: { fontSize: 16, textAlign: 'center', marginTop: 40 },
});

export default DayViolationsScreen;