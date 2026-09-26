import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Production configuration for Cleankr (Firebase Project ID: cleankr-724ce)
// Configuration values are loaded from environment variables (see .env / .env.example)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cleankr-724ce.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cleankr-724ce",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cleankr-724ce.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "19721903127",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (e) {
  console.warn("Firebase initialization warning (using local fallback if offline):", e);
}

export { app, auth, db, storage };
