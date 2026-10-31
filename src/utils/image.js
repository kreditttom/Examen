const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Байти фото в base64-рядок
export const bytesToBase64 = (bytes) => {
    let result = '';
    for (let i = 0; i < bytes.length; i += 3) {
        const b1 = bytes[i];
        const b2 = i + 1 < bytes.length ? bytes[i + 1] : 0;
        const b3 = i + 2 < bytes.length ? bytes[i + 2] : 0;

        result += chars[b1 >> 2];
        result += chars[((b1 & 3) << 4) | (b2 >> 4)];
        result += i + 1 < bytes.length ? chars[((b2 & 15) << 2) | (b3 >> 6)] : '=';
        result += i + 2 < bytes.length ? chars[b3 & 63] : '=';
    }
    return result;
};

// base64-рядок у байти
export const base64ToBytes = (base64) => {
    const clean = base64.replace(/[^A-Za-z0-9+/]/g, '');
    const length = Math.floor((clean.length * 3) / 4);
    const bytes = new Uint8Array(length);

    let p = 0;
    for (let i = 0; i < clean.length; i += 4) {
        const e1 = chars.indexOf(clean[i]);
        const e2 = chars.indexOf(clean[i + 1]);
        const e3 = i + 2 < clean.length ? chars.indexOf(clean[i + 2]) : 0;
        const e4 = i + 3 < clean.length ? chars.indexOf(clean[i + 3]) : 0;

        bytes[p++] = (e1 << 2) | (e2 >> 4);
        if (i + 2 < clean.length) { bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2); }
        if (i + 3 < clean.length) { bytes[p++] = ((e3 & 3) << 6) | e4; }
    }
    return bytes;
};