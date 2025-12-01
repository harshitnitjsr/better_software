import React, { useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import Navigation from "./src/navigation";
import { initializeFirebase } from "./src/config/firebase";

export default function App() {
  useEffect(() => {
    // Initialize Firebase when app starts
    try {
      initializeFirebase();
      console.log("Firebase initialized successfully");
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </SafeAreaView>
  );
}
