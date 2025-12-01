import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "../../config/firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export class AuthService {
  private getAuth() {
    const auth = getFirebaseAuth();
    if (!auth) {
      throw new Error(
        "Authentication not available. Please configure Firebase or run in offline mode."
      );
    }
    return auth;
  }

  /**
   * Register a new user with email and password
   */
  async register(email: string, password: string): Promise<AuthUser> {
    try {
      const auth = this.getAuth();
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      return this.mapUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const auth = this.getAuth();
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return this.mapUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      const auth = this.getAuth();
      await signOut(auth);
    } catch (error: any) {
      throw new Error("Failed to logout: " + error.message);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    try {
      const auth = this.getAuth();
      return auth.currentUser;
    } catch (error) {
      return null;
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    try {
      const auth = this.getAuth();
      return onAuthStateChanged(auth, (user) => {
        callback(user ? this.mapUser(user) : null);
      });
    } catch (error) {
      console.error("Auth state change listener failed:", error);
      callback(null);
      return () => {};
    }
  }

  /**
   * Map Firebase User to AuthUser
   */
  private mapUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: any): Error {
    let message = "Authentication failed";

    switch (error.code) {
      case "auth/email-already-in-use":
        message = "This email is already registered";
        break;
      case "auth/invalid-email":
        message = "Invalid email address";
        break;
      case "auth/weak-password":
        message = "Password should be at least 6 characters";
        break;
      case "auth/user-not-found":
        message = "No account found with this email";
        break;
      case "auth/wrong-password":
        message = "Incorrect password";
        break;
      case "auth/too-many-requests":
        message = "Too many failed attempts. Please try again later";
        break;
      default:
        message = error.message || "Authentication failed";
    }

    return new Error(message);
  }
}

// Export singleton instance
export const authService = new AuthService();
