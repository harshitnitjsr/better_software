import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  getUserProgress,
  getUserQuizHistory,
  type UserProgress,
  type QuizHistory,
} from "../../services/firebase/firestoreService";
import { useUserStore } from "../../store/userStore";

export default function ProgressScreen() {
  const user = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizHistory[]>([]);

  useEffect(() => {
    loadProgress();
  }, [user]);

  async function loadProgress() {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [progressData, quizHistory] = await Promise.all([
        getUserProgress(user.uid),
        getUserQuizHistory(user.uid, 5),
      ]);
      setProgress(progressData);
      setRecentQuizzes(quizHistory);
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  }

  if (!user) {
    return (
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.centerContainer}
      >
        <Text style={styles.guestIcon}>👤</Text>
        <Text style={styles.guestMessage}>Login to track your progress</Text>
        <Text style={styles.guestHint}>
          Complete quizzes and create flashcards to see your stats here
        </Text>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  const hasProgress = progress && progress.totalQuizzesTaken > 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Keep learning and growing! 🌱</Text>
      </LinearGradient>

      {!hasProgress ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No progress yet</Text>
          <Text style={styles.emptyMessage}>
            Take a quiz or create flashcards to start tracking your progress!
          </Text>
        </View>
      ) : (
        <>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={["#4facfe", "#00f2fe"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statValue}>{progress.totalQuizzesTaken}</Text>
              <Text style={styles.statLabel}>Quizzes</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#43e97b", "#38f9d7"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statValue}>
                {progress.totalQuestionsAnswered}
              </Text>
              <Text style={styles.statLabel}>Questions</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#fa709a", "#fee140"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statValue}>
                {progress.averageScore.toFixed(1)}%
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#a8edea", "#fed6e3"]}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.statValue}>{progress.xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </LinearGradient>
          </View>

          {/* Streak Card */}
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            style={styles.streakCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.streakIcon}>🔥</Text>
            <View style={styles.streakContent}>
              <Text style={styles.streakValue}>{progress.streakDays} Days</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
          </LinearGradient>

          {/* Recent Quiz History */}
          {recentQuizzes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Quizzes</Text>
              {recentQuizzes.map((quiz, index) => (
                <View key={quiz.id || index} style={styles.quizCard}>
                  <View style={styles.quizHeader}>
                    <Text style={styles.quizSubject}>{quiz.subject}</Text>
                    <Text
                      style={[
                        styles.quizScore,
                        quiz.percentage >= 70
                          ? styles.scoreGood
                          : quiz.percentage >= 50
                          ? styles.scoreMedium
                          : styles.scorePoor,
                      ]}
                    >
                      {quiz.percentage}%
                    </Text>
                  </View>
                  {quiz.topic && (
                    <Text style={styles.quizTopic}>{quiz.topic}</Text>
                  )}
                  <View style={styles.quizFooter}>
                    <Text style={styles.quizDifficulty}>
                      {quiz.difficulty.toUpperCase()}
                    </Text>
                    <Text style={styles.quizDetails}>
                      {quiz.score}/{quiz.totalQuestions} correct
                    </Text>
                    <Text style={styles.quizDate}>
                      {formatDate(quiz.completedAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Performance Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>
                {progress.averageScore >= 80
                  ? "🌟 Excellent performance! You're mastering the material."
                  : progress.averageScore >= 60
                  ? "👍 Good work! Keep practicing to improve further."
                  : progress.averageScore >= 40
                  ? "📚 You're making progress. Consider reviewing difficult topics."
                  : "💪 Keep learning! Consistency is key to improvement."}
              </Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
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
    padding: 30,
    paddingTop: 50,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  guestIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  guestMessage: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  guestHint: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  emptyState: {
    padding: 60,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
    margin: "1%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    opacity: 0.9,
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  streakIcon: {
    fontSize: 56,
    marginRight: 20,
  },
  streakContent: {
    flex: 1,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    fontWeight: "600",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
    paddingHorizontal: 4,
  },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  quizSubject: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    color: "#333",
  },
  quizScore: {
    fontSize: 20,
    fontWeight: "800",
  },
  scoreGood: {
    color: "#43e97b",
  },
  scoreMedium: {
    color: "#fa709a",
  },
  scorePoor: {
    color: "#f5576c",
  },
  quizTopic: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  quizFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quizDifficulty: {
    fontSize: 10,
    fontWeight: "600",
    color: "#007AFF",
    backgroundColor: "#E5F1FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  quizDetails: {
    fontSize: 12,
    color: "#666",
    flex: 1,
    textAlign: "center",
  },
  quizDate: {
    fontSize: 12,
    color: "#999",
  },
  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  insightText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
