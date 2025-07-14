import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '../services/auth.service';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      console.log("respose : ", response);
      if (response.data?.accessToken && response.data?.user) {
        setAuth({
          token: response.data.accessToken,
          user: response.data.user,
        });
        
        // Cache user data in React Query
        queryClient.setQueryData(['auth', 'user'], response.data.user);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Clear all cached queries
    },
    onError: (error) => {
      // Even if logout fails on server, clear local state
      console.error('Logout failed:', error);
      clearAuth();
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onError: (error) => {
      console.error('Forgot password failed:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onError: (error) => {
      console.error('Reset password failed:', error);
    },
  });
};

// Hook to get current auth state
export const useAuthState = () => {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  
  return {
    user,
    isAuthenticated: isAuthenticated(),
    isInitialized,
    isAdmin: user?.role === 'ADMIN',
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
  };
};

// Fetch current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await authService.getProfile();
      return response.data.user;
    },
  });
};