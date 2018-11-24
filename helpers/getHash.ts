import * as crypto from 'crypto';

export function getHash(byteSize = 48) {
    const bytes = crypto.randomBytes(byteSize);
    return bytes.toString('hex');
}