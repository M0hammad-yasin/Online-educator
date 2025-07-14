import { BaseService,ApiResponse } from '../../../services';
import {User, UserRole} from '../store/authStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
export interface AuthResponse {
  user: User;
  accessToken: string;
}

class AuthService extends BaseService<any> {
  constructor() {
    super('/student');
  }
  setRole(role: UserRole | null) {
    switch (role) {
      case 'ADMIN':
        this.endpoint = '/admin';
        break;
      case 'TEACHER':
        this.endpoint = '/teacher';
        break;
      case 'MODERATOR':
        this.endpoint='/moderator';
        break;
      case 'STUDENT':
      default:
        this.endpoint = '/student';
        break;
    }
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

  async getProfile(): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    return await (this.customGet<{ user: AuthResponse['user'] }>('/me'));
  }
}

export const authService = new AuthService();