import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';
// Ensure ENCRYPTION_KEY is 32 bytes (hex string or raw)
// For this demo, we'll assume it's provided or fallback to a generated one (NOT SAFE FOR PROD persistence across restarts if random)
// In real usage, user must set ENCRYPTION_KEY in .env
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') 
  : randomBytes(32); 
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
