import { fetchUnsyncedViolations, markAsSynced } from '../../src/database';
import { uploadPhoto } from './cloudinary';
import { sendViolationRequest } from './violations';
import { bytesToBase64 } from '../../src/utils/image';

let syncing = false;

export const syncViolations = async (token, userId) => {
    if (syncing) {
        console.log('SYNC: вже йде синхронізація, пропускаємо');
        return 0;
    }
    syncing = true;
    let count = 0;

    try {
        const list = await fetchUnsyncedViolations(userId);
        console.log('SYNC: невідправлених записів:', list.length);

        for (const item of list) {
            let url = null;

            console.log('SYNC: розмір фото в байтах:', item.image ? item.image.length : 0);

            if (item.image) {
                console.log('SYNC: вантажимо фото в Cloudinary...');
                const upload = await uploadPhoto('data:image/jpeg;base64,' + bytesToBase64(item.image));
                if (upload.error) {
                    console.log('SYNC: помилка Cloudinary:', upload.error);
                    break;
                }
                url = upload.data;
                console.log('SYNC: фото завантажено:', url);
            }

            console.log('SYNC: відправляємо на сервер...');
            const result = await sendViolationRequest(token, {
                description: item.description,
                url: url,
                date: item.date,
                time: item.time,
                latitude: item.latitude,
                longitude: item.longitude,
            });
            if (result.error) {
                console.log('SYNC: помилка сервера:', result.error);
                break;
            }

            await markAsSynced(item.id);
            console.log('SYNC: відправлено, id =', item.id);
            count++;
        }
    } catch (error) {
        console.log('SYNC: виняток:', error);
    }

    syncing = false;
    return count;
};