import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

export default function FlashcardSetupScreen({ navigation }: any) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState("10");

  const handleGenerate = () => {
    if (!subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return;
    }

    const numberOfCards = parseInt(numCards) || 10;
    if (numberOfCards < 1 || numberOfCards > 50) {
      Alert.alert("Error", "Number of cards must be between 1 and 50");
      return;
    }

    navigation.navigate("FlashcardView", {
      subject: subject.trim(),
      topic: topic.trim() || undefined,
      numCards: numberOfCards,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Flashcard Set</Text>
        <Text style={styles.subtitle}>
          AI will generate flashcards based on your preferences
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mathematics, History, Biology"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Topic (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Algebra, World War II, Cell Biology"
            value={topic}
            onChangeText={setTopic}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Cards</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            value={numCards}
            onChangeText={setNumCards}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>Between 1 and 50 cards</Text>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerate}
        >
          <Text style={styles.generateButtonText}>Generate Flashcards</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  generateButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
