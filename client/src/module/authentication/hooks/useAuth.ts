import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '../services/auth.service';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (response) => {
      if (response.data?.accessToken && response.data?.user) {
        useAuthStore.getState().setAuth({
          token: response.data.accessToken,
          user: response.data.user,
        });
        queryClient.setQueryData(['auth', 'user'], response.data.user);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      queryClient.removeQueries();
      queryClient.setQueryData(['auth', 'user'], null);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
  });
}; 