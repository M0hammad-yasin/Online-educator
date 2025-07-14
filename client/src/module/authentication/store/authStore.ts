import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../../../constants/role';
import { authService } from '../services/auth.service';
import {mountStoreDevtool} from 'simple-zustand-devtools'
export type UserRole = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
 profilePicture:string; 
}

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  setAuth: (data: { token: string; user: User }) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  initializeAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isInitialized: false,
      
      setAuth: (data) => {
        // Store token in localStorage for API calls
        localStorage.setItem('accessToken', data.token);
        set({ 
          token: data.token, 
          user: data.user,
          isInitialized: true 
        });
      },
      
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ 
          token: null, 
          user: null,
          isInitialized: true 
        });
      },
      
      isAuthenticated: () => {
        const { token } = get();
        return !!token && isTokenValid(token);
      },
      
      initializeAuth: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isInitialized: true });
          return;
        }
        
        // Validate token format first
        if (!isTokenValid(token)) {
          set({ 
            token: null,
            user: null,
            isInitialized: true 
          });
          localStorage.removeItem('accessToken');
          return;
        }
        
        try {
          // Verify token with backend
          const response = await authService.getProfile();
          localStorage.setItem('accessToken', token);
          set({ 
            user: response.data.user,
            isInitialized: true 
          });
        } catch (error) {
          // Clear invalid token
          set({ 
            token: null,
            user: null,
            isInitialized: true 
          });
          localStorage.removeItem('accessToken');
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token 
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize auth after rehydration
        state?.initializeAuth();
      }
    }
  )
);
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('AuthStore', useAuthStore);
}

// Helper function for JWT token validation
function isTokenValid(token: string): boolean {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return payload.exp > now;
  } catch {
    return false;
  }
}

export default useAuthStore;