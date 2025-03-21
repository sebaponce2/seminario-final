import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseAuth } from "./firebase";

export const register = async (credentials) => {
  try {
    const result = await createUserWithEmailAndPassword(
      FirebaseAuth,
      credentials.email,
      credentials.password
    );
    const { displayName, email, photoURL, uid, accessToken } = result.user;
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
      token: accessToken,
    };
  } catch (error) {
    const { code, message } = error;
    return {
      ok: false,
      code,
      message,
    };
  }
};

export const logIn = async (credentials) => {
  try {
    const result = await signInWithEmailAndPassword(
      FirebaseAuth,
      credentials.email,
      credentials.password
    );
    const { displayName, email, photoURL, uid, accessToken } = result.user;
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
      token: accessToken,
    };
  } catch (error) {
    const { code, message } = error;
    return {
      ok: false,
      code,
      message,
    };
  }
};
