import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  const [flipAnim] = useState(new Animated.Value(0));

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
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      flipAnim.setValue(0);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    flipAnim.setValue(0);
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.centerContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Generating flashcards...</Text>
      </LinearGradient>
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

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.subject}>{subject}</Text>
        {topic && <Text style={styles.topic}>{topic}</Text>}
        <Text style={styles.progress}>
          Card {currentIndex + 1} of {flashcards.length}
        </Text>
      </LinearGradient>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={handleFlip}
          activeOpacity={0.9}
          style={styles.cardTouchable}
        >
          <Animated.View
            style={[
              styles.card,
              {
                transform: [
                  { rotateY: isFlipped ? backInterpolate : frontInterpolate },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={
                isFlipped ? ["#43e97b", "#38f9d7"] : ["#4facfe", "#00f2fe"]
              }
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.cardLabel}>
                {isFlipped ? "ANSWER" : "QUESTION"}
              </Text>
              <Text style={styles.cardText}>
                {isFlipped ? currentCard.back : currentCard.front}
              </Text>
              <Text style={styles.tapHint}>Tap to flip</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartButtonText}>🔄 Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, isLastCard && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={isLastCard}
        >
          <Text
            style={[
              styles.navButtonText,
              isLastCard && styles.navButtonTextDisabled,
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>

      {isLastCard && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeText}>🎉 You've completed this set!</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#fa709a", "#fee140"]}
              style={styles.doneButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  subject: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  topic: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    fontWeight: "600",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardTouchable: {
    width: width - 40,
    height: 400,
  },
  card: {
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardGradient: {
    flex: 1,
    borderRadius: 24,
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    opacity: 0.8,
    marginBottom: 20,
    letterSpacing: 2,
  },
  cardText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    lineHeight: 32,
  },
  tapHint: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.7,
    marginTop: 20,
    fontStyle: "italic",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#667eea",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonDisabled: {
    backgroundColor: "#ddd",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
  restartButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#f093fb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  completeContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  completeText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  doneButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#667eea",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
