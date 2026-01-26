import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Ensure we have a 32-byte key. 
// IN PRODUCTION: This MUST be set in .env as a 64-character hex string.
// For dev/fallback: we use a fixed key (NOT SECURE FOR PROD but keeps app running)
const FALLBACK_KEY = '0000000000000000000000000000000000000000000000000000000000000000';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || FALLBACK_KEY;

const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(text: string): string {
    if (!text) return text;
    try {
        const iv = randomBytes(IV_LENGTH);
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        const cipher = createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Encryption failed:', error);
        return text; // Fail safe? Or throw? Fail safe keeps app running but unencrypted.
    }
}

export function decrypt(text: string): string {
    if (!text) return text;
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) return text; // Not encrypted or invalid format

        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const key = Buffer.from(ENCRYPTION_KEY, 'hex');
        const decipher = createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        // If decryption fails (wrong key, bad data), return original (might be unencrypted old data)
        return text;
    }
}
