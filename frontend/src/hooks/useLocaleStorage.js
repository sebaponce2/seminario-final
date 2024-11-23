// hashUtils.js
import CryptoJS from "crypto-js";

const secretKey = "JRk][C)m!xmCb-%I:]V0oyS*Fm&y=V";

export const hashData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (hash) => {
  try {
    const bytes = CryptoJS.AES.decrypt(hash, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error("Error al desencriptar o parsear los datos:", error);
    return null;
  }
};

export const saveToLocalStorage = (key, value) => {
  try {
    const hashedValue = hashData(value);
    localStorage.setItem(key, hashedValue);
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const hashedValue = localStorage.getItem(key);
    if (hashedValue) {
      return decryptData(hashedValue);
    }
    return null;
  } catch (error) {
    console.error("Error al cargar desde LocalStorage:", error);
    return null;
  }
};

export const clearLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error al limpiar LocalStorage:", error);
  }
};

export const clearAllLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error al limpiar todo LocalStorage:", error);
  }
};
