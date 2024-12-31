import { useAuthStore } from './auth-store';
import { authService } from './auth-service';

export const useAuth = () => {
  const state = useAuthStore();
  
  return {
    ...state,
    ...authService,
  };
};

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
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
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});