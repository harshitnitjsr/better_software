import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
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
      <View style={styles.centerContainer}>
        <Text style={styles.guestText}>👤</Text>
        <Text style={styles.guestMessage}>Login to track your progress</Text>
        <Text style={styles.guestHint}>
          Complete quizzes and create flashcards to see your stats here
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Keep learning and growing! 🌱</Text>
      </View>

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
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress.totalQuizzesTaken}</Text>
              <Text style={styles.statLabel}>Quizzes Taken</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {progress.totalQuestionsAnswered}
              </Text>
              <Text style={styles.statLabel}>Questions Answered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {progress.averageScore.toFixed(1)}%
              </Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{progress.xp}</Text>
              <Text style={styles.statLabel}>XP Earned</Text>
            </View>
          </View>

          {/* Streak Card */}
          <View style={styles.streakCard}>
            <Text style={styles.streakIcon}>🔥</Text>
            <View style={styles.streakContent}>
              <Text style={styles.streakValue}>{progress.streakDays} Days</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
          </View>

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
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  guestText: {
    fontSize: 60,
    marginBottom: 16,
  },
  guestMessage: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  guestHint: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: "1%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  streakIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  streakContent: {
    flex: 1,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  streakLabel: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  quizSubject: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  quizScore: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreGood: {
    color: "#34C759",
  },
  scoreMedium: {
    color: "#FF9500",
  },
  scorePoor: {
    color: "#FF3B30",
  },
  quizTopic: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
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
