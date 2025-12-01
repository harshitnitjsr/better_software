import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "./env";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase() {
  if (!app) {
    try {
      // Only initialize if config looks valid
      if (
        FIREBASE_CONFIG.apiKey &&
        FIREBASE_CONFIG.apiKey !== "your_firebase_api_key"
      ) {
        app = initializeApp(FIREBASE_CONFIG);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log("Firebase initialized successfully");
      } else {
        console.warn("Firebase config not set, running in offline mode");
      }
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      console.warn("Running in offline mode");
    }
  }
  return { app, auth, db, storage };
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    try {
      initializeFirebase();
    } catch (error) {
      console.error("Failed to get Auth:", error);
      return null;
    }
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (!db) {
    try {
      initializeFirebase();
    } catch (error) {
      console.error("Failed to get Firestore:", error);
      return null;
    }
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
}

export { auth, db, storage };
