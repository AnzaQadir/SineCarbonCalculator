import { create } from 'zustand';

interface User {
  id?: string;
  name: string;
  email?: string;
  profileImage?: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const STORAGE_KEY = 'zerrah_user_store';

// Load initial state from localStorage
const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load user from localStorage:', error);
  }
  return null;
};

export const useUserStore = create<UserStore>((set) => ({
  user: loadUserFromStorage(),
  setUser: (user) => {
    set({ user });
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  },
  clearUser: () => {
    set({ user: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
})); 