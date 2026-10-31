import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import ViolationItem from '../components/violationItem';
import { fetchLocationsRequest, fetchByLocationRequest } from '../../server/api/violations';
import { useTheme } from '../context/ThemeContext';

const START_REGION = {
    latitude: 49.9935,
    longitude: 36.2304,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
};

const MapScreen = () => {
    const { colors } = useTheme();
    const [locations, setLocations] = useState([]);
    const [selected, setSelected] = useState([]);
    const [error, setError] = useState('');

    useFocusEffect(
        useCallback(() => {
            fetchLocationsRequest().then((result) => {
                if (result.error) { setError(result.error);}
                else {
                    setError('');
                    setLocations(result.data);
                }
            });
        }, [])
    );

    const handleMarkerPress = (item) => {
        fetchByLocationRequest(item.latitude, item.longitude).then((result) => {
            if (result.data) { setSelected(result.data); }
        });
    };

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={START_REGION}>
                {locations.map((item) => (
                    <Marker
                        key={item.id}
                        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                        onPress={() => handleMarkerPress(item)}
                    />
                ))}
            </MapView>

            <View style={[styles.panel, { backgroundColor: colors.background }]}>
                {error !== '' && <Text style={{ color: colors.danger }}>{error}</Text>}
                {selected.length === 0 ? (
                    <Text style={{ color: colors.mutedText }}>Натисни на маркер, щоб побачити правопорушення</Text>
                ) : (
                    <FlatList
                        data={selected}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item }) => <ViolationItem violation={item} />}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    panel: { height: 220, padding: 12 },
});

export default MapScreen;