import CryptoJS from 'crypto-js';

const secret = '$2b$10$GypBAEIkKes7or5vL1qM9ubXEZjd95uhUur8BX0rZ85CdS.iGq.HW';
export const encrypter = (message) => {
  return CryptoJS.AES.encrypt(message, secret).toString();
};
export const decrypter = (text) => {
  const bytes = CryptoJS.AES.decrypt(text, secret);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};
