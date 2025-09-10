import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.randomBytes(32); // In production, use a fixed key from env
const IV = crypto.randomBytes(16);

export function encryptObject(obj: any): { iv: string; encrypted: string } {
    const json = JSON.stringify(obj);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
    let encrypted = cipher.update(json, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return { iv: IV.toString('base64'), encrypted };
}

export function decryptObject(iv: string, encrypted: string): any {
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'base64'));
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
}
