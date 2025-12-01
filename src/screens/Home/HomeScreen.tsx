import React from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Education AI Doubt Solver</Text>
        <Text style={styles.subtitle}>Your AI-powered learning companion</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Ask a Question"
            onPress={() => navigation.navigate("Ask")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Scan Question (OCR)"
            onPress={() => navigation.navigate("OCRScanner")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="My Flashcards"
            onPress={() => navigation.navigate("FlashcardList")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Take Quiz"
            onPress={() => navigation.navigate("QuizSetup")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="My Progress"
            onPress={() => navigation.navigate("Progress")}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 12,
  },
});
