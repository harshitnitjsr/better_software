import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "../../config/firebase";

// Get DB with null check
function getDb() {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error("Firestore not initialized. Running in offline mode.");
  }
  return db;
}

// Collection names
const COLLECTIONS = {
  USERS: "users",
  FLASHCARD_SETS: "flashcard_sets",
  QUIZ_HISTORY: "quiz_history",
  PROGRESS: "progress",
};

// Types
export interface FlashcardSet {
  id?: string;
  userId: string;
  subject: string;
  topic?: string;
  cards: Array<{ front: string; back: string }>;
  createdAt: Date;
}

export interface QuizHistory {
  id?: string;
  userId: string;
  subject: string;
  topic?: string;
  difficulty: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}

export interface UserProgress {
  userId: string;
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  streakDays: number;
  lastActiveDate: Date;
  xp: number;
}

/**
 * Save flashcard set to Firestore
 */
export async function saveFlashcardSet(
  flashcardSet: FlashcardSet
): Promise<string> {
  try {
    const db = getDb();
    const docRef = doc(collection(db, COLLECTIONS.FLASHCARD_SETS));
    const data: any = {
      userId: flashcardSet.userId,
      subject: flashcardSet.subject,
      cards: flashcardSet.cards,
      id: docRef.id,
      createdAt: Timestamp.fromDate(flashcardSet.createdAt),
    };
    // Only add topic if it's defined
    if (flashcardSet.topic) {
      data.topic = flashcardSet.topic;
    }
    await setDoc(docRef, data);
    return docRef.id;
  } catch (error: any) {
    throw new Error("Failed to save flashcard set: " + error.message);
  }
}

/**
 * Get all flashcard sets for a user
 */
export async function getUserFlashcardSets(
  userId: string
): Promise<FlashcardSet[]> {
  try {
    const db = getDb();
    const q = query(
      collection(db, COLLECTIONS.FLASHCARD_SETS),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
      } as FlashcardSet;
    });
  } catch (error: any) {
    console.error("Error fetching flashcard sets:", error);
    return [];
  }
}

/**
 * Delete a flashcard set
 */
export async function deleteFlashcardSet(setId: string): Promise<void> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, COLLECTIONS.FLASHCARD_SETS, setId));
  } catch (error: any) {
    throw new Error("Failed to delete flashcard set: " + error.message);
  }
}

/**
 * Save quiz result to history
 */
export async function saveQuizHistory(history: QuizHistory): Promise<string> {
  try {
    const db = getDb();
    const docRef = doc(collection(db, COLLECTIONS.QUIZ_HISTORY));
    const data: any = {
      userId: history.userId,
      subject: history.subject,
      difficulty: history.difficulty,
      score: history.score,
      totalQuestions: history.totalQuestions,
      percentage: history.percentage,
      id: docRef.id,
      completedAt: Timestamp.fromDate(history.completedAt),
    };
    // Only add topic if it's defined
    if (history.topic) {
      data.topic = history.topic;
    }
    await setDoc(docRef, data);

    // Update user progress
    await updateUserProgress(history.userId, history);

    return docRef.id;
  } catch (error: any) {
    throw new Error("Failed to save quiz history: " + error.message);
  }
}

/**
 * Get quiz history for a user
 */
export async function getUserQuizHistory(
  userId: string,
  limitCount: number = 10
): Promise<QuizHistory[]> {
  try {
    const db = getDb();
    const q = query(
      collection(db, COLLECTIONS.QUIZ_HISTORY),
      where("userId", "==", userId),
      orderBy("completedAt", "desc"),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        completedAt: data.completedAt.toDate(),
      } as QuizHistory;
    });
  } catch (error: any) {
    console.error("Error fetching quiz history:", error);
    return [];
  }
}

/**
 * Update user progress based on quiz completion
 */
async function updateUserProgress(
  userId: string,
  quizResult: QuizHistory
): Promise<void> {
  try {
    const db = getDb();
    const progressRef = doc(db, COLLECTIONS.PROGRESS, userId);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
      const currentProgress = progressDoc.data() as UserProgress;
      const totalQuizzes = currentProgress.totalQuizzesTaken + 1;
      const totalQuestions =
        currentProgress.totalQuestionsAnswered + quizResult.totalQuestions;
      const newAverageScore =
        (currentProgress.averageScore * currentProgress.totalQuizzesTaken +
          quizResult.percentage) /
        totalQuizzes;

      await updateDoc(progressRef, {
        totalQuizzesTaken: totalQuizzes,
        totalQuestionsAnswered: totalQuestions,
        averageScore: newAverageScore,
        lastActiveDate: Timestamp.now(),
        xp: currentProgress.xp + Math.floor(quizResult.percentage),
      });
    } else {
      // Create new progress document
      const newProgress: UserProgress = {
        userId,
        totalQuizzesTaken: 1,
        totalQuestionsAnswered: quizResult.totalQuestions,
        averageScore: quizResult.percentage,
        streakDays: 1,
        lastActiveDate: new Date(),
        xp: Math.floor(quizResult.percentage),
      };
      await setDoc(progressRef, {
        ...newProgress,
        lastActiveDate: Timestamp.fromDate(newProgress.lastActiveDate),
      });
    }
  } catch (error: any) {
    console.error("Error updating user progress:", error);
  }
}

/**
 * Get user progress
 */
export async function getUserProgress(
  userId: string
): Promise<UserProgress | null> {
  try {
    const db = getDb();
    const progressRef = doc(db, COLLECTIONS.PROGRESS, userId);
    const progressDoc = await getDoc(progressRef);

    if (progressDoc.exists()) {
      const data = progressDoc.data();
      return {
        ...data,
        lastActiveDate: data.lastActiveDate.toDate(),
      } as UserProgress;
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching user progress:", error);
    return null;
  }
}

/**
 * Save or update user profile
 */
export async function saveUserProfile(
  userId: string,
  profile: { displayName?: string; email?: string; photoURL?: string }
): Promise<void> {
  try {
    const db = getDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, profile, { merge: true });
  } catch (error: any) {
    throw new Error("Failed to save user profile: " + error.message);
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string): Promise<any> {
  try {
    const db = getDb();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
