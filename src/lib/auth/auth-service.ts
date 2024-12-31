import { supabase } from '../supabase';
import { useAuthStore } from './auth-store';

export const authService = {
  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      useAuthStore.setState({
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
      useAuthStore.setState({
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
      useAuthStore.setState({
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
    useAuthStore.setState({ user: null, isAuthenticated: false });
  },
};