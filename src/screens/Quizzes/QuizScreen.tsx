import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { LinearGradient } from "expo-linear-gradient";
import { generateQuiz } from "../../services/ai/quizGenerator";
import { saveQuizHistory } from "../../services/firebase/firestoreService";
import { useUserStore } from "../../store/userStore";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizScreen({ route, navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const subject = route.params?.subject || "General Knowledge";
  const topic =
    route.params?.topic || route.params?.subject || "General Knowledge";
  const difficulty = route.params?.difficulty || "medium";
  const numQuestions = route.params?.numQuestions || 5;

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    loadQuiz();
  }, []);

  async function loadQuiz() {
    setLoading(true);
    try {
      const questions = await generateQuiz(topic, difficulty, numQuestions);
      setQuiz(questions);
    } catch (error) {
      Alert.alert("Error", "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(optionIndex: number) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(optionIndex);
    if (optionIndex === quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setAnsweredQuestions([...answeredQuestions, currentQuestion]);
  }

  function nextQuestion() {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      saveQuizResult();
    }
  }

  async function saveQuizResult() {
    if (!user) {
      console.log("No user logged in, skipping quiz save");
      return;
    }

    try {
      const percentage = Math.round((score / quiz.length) * 100);
      await saveQuizHistory({
        userId: user.uid,
        subject,
        topic,
        difficulty,
        score,
        totalQuestions: quiz.length,
        percentage,
        completedAt: new Date(),
      });
      console.log("Quiz result saved successfully");
    } catch (error) {
      console.error("Failed to save quiz result:", error);
    }
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions([]);
    loadQuiz();
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Generating quiz...</Text>
      </View>
    );
  }

  if (quiz.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load quiz</Text>
        <TouchableOpacity style={styles.button} onPress={loadQuiz}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Complete! 🎉</Text>
          <Text style={styles.resultScore}>
            Your Score: {score}/{quiz.length}
          </Text>
          <Text style={styles.resultPercentage}>{percentage}%</Text>

          <View style={styles.resultMessage}>
            <Text style={styles.resultMessageText}>
              {percentage >= 80
                ? "Excellent work! 🌟"
                : percentage >= 60
                ? "Good job! 👍"
                : percentage >= 40
                ? "Not bad! Keep practicing 📚"
                : "Keep learning! 💪"}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={restartQuiz}>
            <Text style={styles.buttonText}>Try New Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.topicText}>{topic}</Text>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {quiz.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionCard}>
          <Markdown style={markdownStyles}>{question.question}</Markdown>
        </View>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrect = selectedAnswer !== null && isCorrect;
            const showWrong = selectedAnswer === index && !isCorrect;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  showCorrect && styles.correctOption,
                  showWrong && styles.wrongOption,
                ]}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <Text
                  style={[
                    styles.optionText,
                    (showCorrect || showWrong) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedAnswer !== null && (
          <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
            <Text style={styles.nextButtonText}>
              {currentQuestion < quiz.length - 1
                ? "Next Question"
                : "See Results"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.scoreBar}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#667eea",
    padding: 20,
    alignItems: "center",
  },
  topicText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    lineHeight: 28,
    color: "#333",
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  correctOption: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
  },
  wrongOption: {
    backgroundColor: "#f8d7da",
    borderColor: "#dc3545",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#0066cc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scoreBar: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0066cc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#dc3545",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    minWidth: 200,
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    padding: 20,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 24,
    color: "#0066cc",
    marginBottom: 8,
  },
  resultPercentage: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 20,
  },
  resultMessage: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultMessageText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
});

const markdownStyles = {
  body: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
  },
  heading1: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#667eea",
  },
  code_inline: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
    fontSize: 16,
  },
  code_block: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    fontFamily: "monospace",
    fontSize: 14,
  },
};
