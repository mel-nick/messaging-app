import CryptoJS from 'crypto-js';

export const encrypter = (message, secret) => {
  return CryptoJS.AES.encrypt(message, secret).toString();
};
export const decrypter = (text, secret) => {
  const bytes = CryptoJS.AES.decrypt(text, secret);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
