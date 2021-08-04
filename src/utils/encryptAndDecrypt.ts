import { DES, enc } from 'crypto-js';
import amplitude from 'amplitude-js';

export const deviceId = amplitude.getInstance().options.deviceId || '';

export const encryptData = (originalData: string, privateKey: string) => {
  return DES.encrypt(originalData, privateKey).toString();
};

export const decryptData = (encryptedData: string, privateKey: string) => {
  const bytes = DES.decrypt(encryptedData, privateKey);
  return bytes.toString(enc.Utf8);
};
