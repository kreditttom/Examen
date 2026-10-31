import { useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { insertViolation } from '../database';
import { toDateKey } from '../utils/date';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import * as FileSystem from 'expo-file-system/legacy';
import { base64ToBytes } from '../utils/image';
import { syncViolations } from '../../server/api/sync';
import NetInfo from '@react-native-community/netinfo';


const AddViolationScreen = () => {
    const { colors } = useTheme();
    const { user, token } = useAuth();
    const cameraRef = useRef(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [showCamera, setShowCamera] = useState(false);
    const [photoUri, setPhotoUri] = useState(null);
    const [description, setDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const takePhoto = async () => {
        if (!cameraRef.current) { return; }
        // quality 0.4, щоб фото не було величезним
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.4 });
        setPhotoUri(photo.uri);
        setShowCamera(false);
    };

    const openCamera = async () => {
        if (!permission || !permission.granted) {
            const result = await requestPermission();
            if (!result.granted) {
                Alert.alert('Помилка', 'Потрібен дозвіл на камеру');
                return;
            }
        }
        setShowCamera(true);
    };

    const handleSave = async () => {
        if (!photoUri) {
            Alert.alert('Помилка', 'Зробіть фото правопорушення');
            return;
        }
        if (description.trim() === '') {
            Alert.alert('Помилка', 'Введіть опис');
            return;
        }

        setSaving(true);

        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') {
            Alert.alert('Помилка', 'Потрібен дозвіл на геолокацію');
            setSaving(false);
            return;
        }
        const position = await Location.getCurrentPositionAsync({});

        const base64 = await FileSystem.readAsStringAsync(photoUri, {
            encoding: 'base64',
        });
        const bytes = base64ToBytes(base64);
        console.log('PHOTO: розмір у байтах:', bytes.length);
        const now = new Date();
        const date = toDateKey(now.getFullYear(), now.getMonth(), now.getDate());
        const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');

        await insertViolation(
            description.trim(),
            bytes,
            date,
            time,
            String(user.id),
            position.coords.latitude,
            position.coords.longitude
        );

        const state = await NetInfo.fetch();
        const online = state.isConnected && state.isInternetReachable !== false;

        let message = '';
        if (online) {
            const sent = await syncViolations(token, user.id);
            message = sent > 0
                ? 'Правопорушення відправлено на сервер'
                : 'Не вдалося відправити, збережено на телефоні. Відправимо пізніше';
        } else { message = 'Немає інтернету. Збережено на телефоні, відправимо, коли з\'явиться мережа';}

        setPhotoUri(null);
        setDescription('');
        setSaving(false);
        Alert.alert('Готово', message);
    };

    if (showCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView ref={cameraRef} style={styles.camera} facing="back" />
                <View style={styles.cameraButtons}>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={() => setShowCamera(false)}>
                        <Text style={styles.btnText}>Скасувати</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, { backgroundColor: colors.today }]} onPress={takePhoto}>
                        <Text style={styles.btnText}>Зробити фото</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const inputStyle = [ styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border },];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} />}

            <TouchableOpacity style={[styles.btn, { backgroundColor: colors.today }]} onPress={openCamera}>
                <Text style={styles.btnText}>{photoUri ? 'Зробити фото ще раз' : 'Зробити фото'}</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { color: colors.text }]}>Опис</Text>
            <TextInput
                style={[inputStyle, styles.multiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="Що сталося?"
                placeholderTextColor={colors.mutedText}
                multiline/>

            <Text style={{ color: colors.mutedText, marginBottom: 12 }}>
                Дата, час і геолокація додадуться автоматично
            </Text>

            <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.today, opacity: saving ? 0.5 : 1 }]}
                onPress={handleSave}
                disabled={saving}>
                <Text style={styles.btnText}>{saving ? 'Збереження...' : 'Зберегти'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    cameraContainer: {
        flex: 1
    },
    camera: {
        flex: 1
    },
    cameraButtons: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    photo: {
        width: '100%',
        height: 250,
        marginBottom: 12
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 6
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 12
    },
    multiline: {
        height: 100,
        textAlignVertical: 'top'
    },
    btn: {
        padding: 14,
        alignItems: 'center'
    },
    btnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600'
    },
});

export default AddViolationScreen;