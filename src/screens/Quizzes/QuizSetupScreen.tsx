import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function QuizSetupScreen({ navigation }: any) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState("5");

  const difficulties = ["easy", "medium", "hard"];

  function handleStartQuiz() {
    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    navigation.navigate("Quiz", {
      subject: subject.trim(),
      topic: topic.trim() || subject.trim(),
      difficulty,
      numQuestions: parseInt(numQuestions) || 5,
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Your Quiz</Text>
        <Text style={styles.subtitle}>
          Customize your quiz based on what you want to learn
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Mathematics, Science, History"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Specific Topic (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Algebra, Photosynthesis, World War II"
            value={topic}
            onChangeText={setTopic}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Difficulty Level</Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive,
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    difficulty === level && styles.difficultyTextActive,
                  ]}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Questions</Text>
          <TextInput
            style={styles.input}
            placeholder="5"
            value={numQuestions}
            onChangeText={setNumQuestions}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <Text style={styles.helperText}>Recommended: 5-10 questions</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
          <Text style={styles.startButtonText}>Generate Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 10,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  difficultyButtonActive: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  difficultyTextActive: {
    color: "#fff",
  },
  startButton: {
    backgroundColor: "#0066cc",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  backButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
