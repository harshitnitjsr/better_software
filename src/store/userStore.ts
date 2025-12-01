import { create } from "zustand";

interface UserState {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  setUser: (user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  isAuthenticated: () => get().user !== null,
}));
