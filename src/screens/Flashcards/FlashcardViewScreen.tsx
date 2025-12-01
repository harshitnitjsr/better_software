import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import {
  generateFlashcards,
  Flashcard,
} from "../../services/ai/flashcardGenerator";
import { saveFlashcardSet } from "../../services/firebase/firestoreService";
import { useUserStore } from "../../store/userStore";

const { width } = Dimensions.get("window");

export default function FlashcardViewScreen({ route, navigation }: any) {
  const { subject, topic, numCards } = route.params || {};

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const cards = await generateFlashcards(
        subject || "General Knowledge",
        topic,
        numCards || 10
      );

      if (cards && cards.length > 0) {
        setFlashcards(cards);
        setLoading(false);

        // Save to Firestore in background (don't block UI)
        if (user) {
          saveFlashcardSet({
            userId: user.uid,
            subject: subject || "General Knowledge",
            topic,
            cards: cards.map((c) => ({ front: c.front, back: c.back })),
            createdAt: new Date(),
          })
            .then(() => console.log("Flashcard set saved to Firestore"))
            .catch((err) => console.log("Failed to save flashcards:", err));
        }
      } else {
        throw new Error("No flashcards generated");
      }
    } catch (error: any) {
      console.error("Flashcard generation error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to generate flashcards. Please try again."
      );
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Generating flashcards...</Text>
      </View>
    );
  }

  if (flashcards.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No flashcards available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFlashcards}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subject}>{subject}</Text>
        {topic && <Text style={styles.topic}>{topic}</Text>}
        <Text style={styles.progress}>
          Card {currentIndex + 1} of {flashcards.length}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.card, isFlipped && styles.cardFlipped]}
        onPress={handleFlip}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>
            {isFlipped ? "ANSWER" : "QUESTION"}
          </Text>
          <Text style={styles.cardText}>
            {isFlipped ? currentCard.back : currentCard.front}
          </Text>
        </View>
        <Text style={styles.tapHint}>Tap to flip</Text>
      </TouchableOpacity>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartButtonText}>Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, isLastCard && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={isLastCard}
        >
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {isLastCard && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeText}>
            You've reached the end of this set!
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  subject: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  topic: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: "#999",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  cardFlipped: {
    backgroundColor: "#007AFF",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    marginBottom: 16,
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 20,
    textAlign: "center",
    lineHeight: 28,
  },
  tapHint: {
    fontSize: 12,
    color: "#999",
    marginTop: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  navButtonDisabled: {
    backgroundColor: "#ccc",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  restartButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  restartButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  completeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  completeText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  doneButton: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
