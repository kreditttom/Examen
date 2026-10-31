import { useEffect } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '../context/AuthContext';
import { syncViolations } from '../../server/api/sync';

function SyncManager() {
    const { user, token } = useAuth();

    useEffect(() => {
        if (!user || !token) { return; }

        const unsubscribe = NetInfo.addEventListener(async (state) => {
            const online = state.isConnected && state.isInternetReachable !== false;
            if (!online) { return; }

            const count = await syncViolations(token, user.id);
            if (count > 0) {
                Alert.alert('Синхронізація', 'Відправлено на сервер: ' + count);
            }
        });

        return unsubscribe;
    }, [user, token]);

    return null;
}

export default SyncManager;