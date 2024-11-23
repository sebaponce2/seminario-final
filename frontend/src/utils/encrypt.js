import CryptoJS from 'crypto-js';

// Clave secreta para el cifrado (¡asegúrate de mantenerla segura y no compartirla!)
const SECRET_KEY = 'JRk][C)m!xmCb-%I:]V0oyS*Fm&y=V';

// Método para encriptar la contraseña
export const encryptPassword = (password) => {
  if (!password) {
    throw new Error('La contraseña no puede estar vacía');
  }
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

// Método para desencriptar la contraseña (si necesitas verificar algo descifrado)
export const decryptPassword = (encryptedPassword) => {
  if (!encryptedPassword) {
    throw new Error('La contraseña cifrada no puede estar vacía');
  }
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
