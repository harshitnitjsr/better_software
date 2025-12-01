import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";

export default function AnswerScreen({ route }: any) {
  const { question, answer, imageUri } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Scanned Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <Text style={styles.sectionTitle}>Question:</Text>
      <Text style={styles.questionText}>{question}</Text>

      <Text style={styles.sectionTitle}>Answer:</Text>
      <Text style={styles.answerText}>{answer}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  questionText: {
    marginBottom: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  answerText: {
    fontSize: 15,
    lineHeight: 24,
  },
});
