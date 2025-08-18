import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

let app = null;
let messaging = null;

// Firebase configuration - matches the config in firebase-messaging-sw.js
const firebaseConfig = {
  apiKey: "AIzaSyBtML9PfxRYtbk-NQFcaeS5ACBqiilXEmQ",
  authDomain: "task-reader.firebaseapp.com",
  projectId: "task-reader",
  storageBucket: "task-reader.firebasestorage.app",
  messagingSenderId: "423297636066",
  appId: "1:423297636066:web:ea4e278e1c5a4ff8acf0bb"
};

/**
 * Get Firebase configuration
 */
export const getFirebaseConfig = async () => {
  return firebaseConfig;
};

/**
 * Initialize Firebase app
 */
export const initializeFirebase = async () => {
  if (app) {
    return { app, messaging };
  }

  try {
    const config = await getFirebaseConfig();
    app = initializeApp(config);
    messaging = getMessaging(app);
    
    return { app, messaging };
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

/**
 * Get Firebase messaging instance
 */
export const getFirebaseMessaging = async () => {
  if (!messaging) {
    await initializeFirebase();
  }
  return messaging;
};
