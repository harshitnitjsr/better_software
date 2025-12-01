import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { askAI } from "../../services/ai/orchestrator";

export default function AskScreen({ navigation, route }: any) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const scannedText = route.params?.scannedText;
  const imageUri = route.params?.imageUri;

  useEffect(() => {
    if (scannedText) {
      setQuestion(scannedText);
    }
  }, [scannedText]);

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const answer = await askAI(question);
      navigation.navigate("Answer", { question, answer, imageUri });
    } catch (error) {
      console.error("Error asking AI:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Type or edit your question:</Text>

      {imageUri && (
        <View style={styles.imagePreview}>
          <Text style={styles.imageLabel}>Scanned Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <TextInput
        placeholder="e.g. Solve x^2 + 3x + 2 = 0"
        value={question}
        onChangeText={setQuestion}
        style={styles.input}
        multiline
        numberOfLines={6}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Asking AI...</Text>
        </View>
      ) : (
        <Button
          title="Ask AI"
          onPress={handleAsk}
          disabled={!question.trim()}
        />
      )}

      <View style={styles.buttonSpacing} />
      <Button
        title="Select AI Provider"
        onPress={() => navigation.navigate("SourceSelector")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  imagePreview: {
    marginBottom: 16,
  },
  imageLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  buttonSpacing: {
    height: 12,
  },
});
