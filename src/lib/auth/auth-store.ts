import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '../types';

interface AuthStore extends AuthState {
  set: (state: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      set: (newState) => set(newState),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);