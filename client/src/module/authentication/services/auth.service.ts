import { BaseService,ApiResponse } from '../../../services';
import {User, UserRole} from '../store/authStore';
import type {Student} from '../../student';
import type { Teacher } from '../../teacher/types';
import type { Moderator } from '../../moderator/types';
import type { Admin } from '../../admin/types';

export type AllUserProps = {
  [K in keyof Student | keyof Teacher | keyof Admin | keyof Moderator]?:
    K extends keyof Student ? Student[K] :
    K extends keyof Teacher ? Teacher[K] :
    K extends keyof Admin ? Admin[K] :
    K extends keyof Moderator ? Moderator[K] :
    never;
};
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
    return this.customGet<{ user: AuthResponse['user'] }>('/me');
  }
  async patchProfile(data: Partial<AllUserProps>): Promise<ApiResponse<AllUserProps>> {
    return await this.customPatch<AllUserProps>('/me', data);
  }
}

export const authService = new AuthService();