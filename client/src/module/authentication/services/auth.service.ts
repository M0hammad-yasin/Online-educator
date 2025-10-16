import { BaseService,ApiResponse } from '../../../services';
import {User, UserRole,AllUserProps, LoginCredentials, RegisterData, AuthResponse } from '..';

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
  getRole(){
    return this.endpoint;
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

  async getProfile(): Promise<ApiResponse<User>> {
    return this.customGet<User>('/me');
  }
  async patchProfile(data: Partial<AllUserProps>): Promise<ApiResponse<AllUserProps>> {
    return await this.customPatch<AllUserProps>('/me', data);
  }
}

export const authService = new AuthService();