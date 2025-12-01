// Environment configuration
// Note: React Native/Expo doesn't support process.env at runtime
// You need to use expo-constants or hardcode your keys here

// For development, you can hardcode keys here
// For production, use Expo's environment variables or expo-constants

export const GEMINI_API_KEY = "AIzaSyBa0XjEJt9SGJuLP3qPaDHJUPUmWX6SWiE"; // Replace with your actual key
export const OPENAI_API_KEY = "your_openai_key_here"; // Optional
export const GROQ_API_KEY = "your_groq_key_here"; // Optional

// Firebase configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyABFShiMqp_yvsk24uEpA87D0M0BXUdaSw",
  authDomain: "assignment-78af4.firebaseapp.com",
  projectId: "assignment-78af4",
  storageBucket: "assignment-78af4.firebasestorage.app",
  messagingSenderId: "6268537408",
  appId: "1:6268537408:web:67183a8fd8bc30f0b0eda5",
  measurementId: "G-DNE2BFYD86"
};

// Note: For better security in production:
// 1. Use expo-constants: import Constants from 'expo-constants';
// 2. Set in app.json extra field or use EAS Secrets
// 3. Access via Constants.expoConfig.extra.apiKey
