import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: process.env.firebaseApiKey,
    authDomain: process.env.firebaseAuthDomain,
    projectid: process.env.firebaseProjectId,
    messagingSenderId: process.env.firebaseMessagingSenderId,
    appId: process.env.firebaseAppId,
}

export const FirebaseApp = initializeApp(firebaseConfig)
export const FirebaseAuth = getAuth(FirebaseApp)