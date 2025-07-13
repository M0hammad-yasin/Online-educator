import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../../../constants/role';
import { authService } from '../services/auth.service';

export type UserRole = (typeof Role)[keyof typeof Role] | null; 
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean; // Track initialization status
  setAuth: (data: { token: string; user: User }) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  initializeAuth: () => Promise<void>; // Renamed for clarity
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isInitialized: false, // Initial state
      setAuth: (data) => set({ 
        token: data.token, 
        user: data.user,
        isInitialized: true 
      }),
      clearAuth: () => set({ 
        token: null, 
        user: null,
        isInitialized: true // Mark as initialized after clear
      }),
      isAuthenticated: () => {
        const { token } = get();
        return !!token && isTokenValid(token); // Add token validation
      },
      initializeAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isInitialized: true });
          return;
        }
        
        try {
          const response = await authService.getProfile();
          set({ 
            user: response.data.user,
            isInitialized: true 
          });
        } catch (error) {
          // Clear invalid token on failed verification
          set({ 
            token: null,
            user: null,
            isInitialized: true 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.initializeAuth(); // Auto-initialize on rehydration
      }
    }
  )
);

// Helper function for token validation
function isTokenValid(token: string): boolean {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default useAuthStore;