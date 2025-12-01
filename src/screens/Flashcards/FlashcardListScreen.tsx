import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { getUserFlashcardSets } from "../../services/firebase/firestoreService";
import { useUserStore } from "../../store/userStore";

export default function FlashcardListScreen({ navigation }: any) {
  const user = useUserStore((state) => state.user);
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFlashcardSets();
  }, [user]);

  async function loadFlashcardSets() {
    if (!user) {
      setFlashcardSets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const sets = await getUserFlashcardSets(user.uid);
      setFlashcardSets(sets);
    } catch (error) {
      console.error("Error loading flashcard sets:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadFlashcardSets();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Flashcard Sets</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate("FlashcardSetup")}
        >
          <Text style={styles.createButtonText}>+ Create New Set</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {flashcardSets.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🗂️</Text>
              <Text style={styles.emptyTitle}>No flashcard sets yet</Text>
              <Text style={styles.emptyText}>
                {user
                  ? "Create your first AI-generated flashcard set!"
                  : "Login to save and view your flashcard sets"}
              </Text>
            </View>
          ) : (
            flashcardSets.map((set) => (
              <TouchableOpacity
                key={set.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate("FlashcardView", {
                    subject: set.subject,
                    topic: set.topic,
                    numCards: set.cards?.length || 10,
                  })
                }
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardSubject}>{set.subject}</Text>
                  {set.topic && (
                    <Text style={styles.cardTopic}>{set.topic}</Text>
                  )}
                  <Text style={styles.cardCount}>
                    {set.cards?.length || 0} cards
                  </Text>
                  <Text style={styles.cardDate}>
                    {formatDate(set.createdAt)}
                  </Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  list: {
    flex: 1,
    padding: 16,
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
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardSubject: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardTopic: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  cardCount: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 11,
    color: "#bbb",
  },
  arrow: {
    fontSize: 20,
    color: "#007AFF",
  },
});
