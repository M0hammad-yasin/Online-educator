import { BaseService } from '../../../services';
import { ApiResponse } from '../../../services/api/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'TEACHER' | 'STUDENT';
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
}

export interface LoginCredentials { /* ... */ }
export interface RegisterData { /* ... */ }
export interface AuthResponse { /* ... */ }

class AuthService extends BaseService<any> {
  constructor() {
    super('/auth');
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.customPost<AuthResponse>('/login', credentials);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.customPost<AuthResponse>('/register', data);
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.customPost<void>('/logout');
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.customPost<AuthResponse>('/refresh-token');
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.customPost<void>('/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return this.customPost<void>('/reset-password', { token, password });
  }
}

export const authService = new AuthService();