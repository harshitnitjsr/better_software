import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your Firebase config from .env or inline
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "your_api_key",
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN || "your_project.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "your_project_id",
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET || "your_project.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "sender_id",
  appId: process.env.FIREBASE_APP_ID || "app_id",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
