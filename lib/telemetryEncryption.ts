import CryptoJS from "crypto-js";

// This key should be stored in an Environment Variable on the Frontend
// It needs to match the key used in the Backend API route
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_TELEMETRY_KEY || "default-hackathon-key-change-me";

/**
 * Encrypts the telemetry payload using AES.
 * Returns a Base64 string.
 */
export function encryptTelemetry(payload: any): string {
  const jsonString = JSON.stringify(payload);
  const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY);
  return encrypted.toString();
}

/**
 * Decrypts the telemetry payload.
 */
export function decryptTelemetry(ciphertext: string): any {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  const jsonString = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonString);
}