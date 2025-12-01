import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Markdown from "react-native-markdown-display";
import { LinearGradient } from "expo-linear-gradient";

export default function AnswerScreen({ route }: any) {
  const { question, answer, imageUri } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>AI Answer</Text>
      </LinearGradient>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>📷 Scanned Image</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>❓ Question</Text>
        <View style={styles.card}>
          <Text style={styles.questionText}>{question}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ Answer</Text>
        <View style={styles.card}>
          <Markdown style={markdownStyles}>{answer}</Markdown>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 30,
    paddingTop: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  section: {
    padding: 16,
  },
  imageContainer: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 12,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    color: "#667eea",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 8,
    color: "#764ba2",
  },
  code_inline: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
    fontSize: 14,
  },
  code_block: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    fontFamily: "monospace",
    fontSize: 14,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  list_item: {
    marginVertical: 4,
  },
};
