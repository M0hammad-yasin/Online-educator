import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role } from '../../../constants/role';
import { authService } from '../services/auth.service';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export type UserRole = (typeof Role)[keyof typeof Role];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture: string;
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
        localStorage.setItem('accessToken', data.token);

        // IMPORTANT: keep authService in sync
        authService.setRole(data.user.role);

        set({
          token: data.token,
          user: data.user,
          isInitialized: true,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('accessToken');

        set({
          token: null,
          user: null,
          isInitialized: true,
        });
      },

      isAuthenticated: () => {
        const { token } = get();
        return !!token && isTokenValid(token);
      },

      initializeAuth: async () => {
        const { token, user } = get();

        if (!token) {
          set({ isInitialized: true });
          return;
        }

        if (!isTokenValid(token)) {
          set({
            token: null,
            user: null,
            isInitialized: true,
          });
          localStorage.removeItem('accessToken');
          return;
        }

        try {
          // keep endpoint in sync before calling
          debugger;
          if (user?.role) {
            authService.setRole(user.role);
          }

          const response = await authService.getProfile();

          localStorage.setItem('accessToken', token);

          set({
            user: response.data,
            isInitialized: true,
          });
        } catch (error) {
          set({
            token: null,
            user: null,
            isInitialized: true,
          });
          localStorage.removeItem('accessToken');
        }
      },
    }),
    {
      name: 'auth-storage',
      // ✅ Save both token and user
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      // ✅ Restore role into authService before init
      onRehydrateStorage: () => (state) => {
        if (state?.user?.role) {
          authService.setRole(state.user.role);
        }
        state?.initializeAuth();
      },
    }
  )
);

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('AuthStore', useAuthStore);
}

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
