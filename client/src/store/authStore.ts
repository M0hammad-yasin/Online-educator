import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../constants/role';

// Define types
// Use Role values directly
export type UserRole = keyof typeof Role | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

// Create the store with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      
      // Check if user is already logged in
      checkAuthStatus: async () => {
        try {
          set({ loading: true });
          // In a real app, you would validate the token with your backend
          const token = localStorage.getItem('auth_token');
          
          if (token) {
            // Simulate fetching user data
            // In a real app, you would decode the token or make an API call
            set({
              user: {
                id: '1',
                name: 'Moni Roy',
                email: 'moni.roy@example.com',
                role: 'ADMIN'
              },
              isAuthenticated: true
            });
          }
        } catch (error) {
          console.error('Authentication check failed:', error);
          localStorage.removeItem('auth_token');
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },
      
      // Login function
      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          // In a real app, you would make an API call to your auth endpoint
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Logging in with email:', email, 'and password:', password);
          // Simulate successful login
          const mockUser = {
            id: '1',
            name: 'Moni Roy',
            email,
            role: 'ADMIN' as UserRole
          };
          
          // Store token in localStorage
          localStorage.setItem('auth_token', 'mock_jwt_token');
          
          set({ 
            user: mockUser,
            isAuthenticated: true,
            loading: false
          });
        } catch (error) {
          console.error('Login failed:', error);
          set({ loading: false });
          throw error;
        }
      },
      
      // Logout function
      logout: async () => {
        set({ loading: true });
        try {
          // In a real app, you might want to invalidate the token on the server
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Clear local storage
          localStorage.removeItem('auth_token');
          
          // Reset state
          set({ 
            user: null, 
            isAuthenticated: false,
            loading: false
          });
        } catch (error) {
          console.error('Logout failed:', error);
          set({ loading: false });
          throw error;
        }
      },
      
      // Forgot password function
      forgotPassword: async (email: string) => {
        set({ loading: true });
        try {
          // In a real app, you would make an API call to your forgot password endpoint
          // Simulating API call with timeout
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // No state changes needed for forgot password
          console.log(`Password reset email sent to ${email}`);
          set({ loading: false });
        } catch (error) {
          console.error('Forgot password request failed:', error);
          set({ loading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        // Only persist these fields from state
        isAuthenticated: state.isAuthenticated,
        user: state.user
      })
    }
  )
);

export default useAuthStore;
