import { create } from 'zustand';
import { AuthState } from './types';
import { supabase } from './supabase';
import { persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  set: (state: Partial<AuthState>) => void;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      set: (newState) => set(newState),

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              firstName: session.user.user_metadata.firstName,
              lastName: session.user.user_metadata.lastName,
              role: 'member',
            },
            isAuthenticated: true,
          });
        }
      },

      signIn: async (email: string, password: string, rememberMe: boolean) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            persistSession: rememberMe
          }
        });

        if (error) throw error;

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              firstName: data.user.user_metadata.firstName,
              lastName: data.user.user_metadata.lastName,
              role: 'member',
            },
            isAuthenticated: true,
          });
        }
      },

      signUp: async (email: string, password: string, firstName: string, lastName: string) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              firstName,
              lastName,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              firstName,
              lastName,
              role: 'member',
            },
            isAuthenticated: true,
          });
        }
      },

      resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuth.setState({
      user: {
        id: session.user.id,
        email: session.user.email!,
        firstName: session.user.user_metadata.firstName,
        lastName: session.user.user_metadata.lastName,
        role: 'member',
      },
      isAuthenticated: true,
    });
  } else if (event === 'SIGNED_OUT') {
    useAuth.setState({ user: null, isAuthenticated: false });
  }
});