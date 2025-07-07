import { BaseApiService, BaseEntity, CreateData, UpdateData } from './baseApiService';
import { apiClient } from './apiClient';

// User entity interface
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  profileImage?: string;
  phoneNumber?: string;
  address?: string;
}

// User-specific query parameters
export interface UserQueryParams {
  role?: 'student' | 'teacher' | 'admin';
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'firstName' | 'lastName' | 'email' | 'createdAt';
  order?: 'asc' | 'desc';
}

// User service class
export class UserService extends BaseApiService<User> {
  constructor() {
    super({
      endpoint: '/users',
      // Optional: Add data transformers if needed
      transformResponse: (data: any) => ({
        ...data,
        // Add any data transformation logic here
        fullName: `${data.firstName} ${data.lastName}`,
      }),
      transformRequest: (data: any): any => {
        // Remove computed properties before sending to API
        const { fullName, ...requestData } = data;
        return requestData;
      },
    });
  }

  // User-specific methods
  async getByEmail(email: string) {
    return this.get(`/email/${email}`);
  }

  async getByRole(role: User['role'], params?: UserQueryParams) {
    return this.get(`/role/${role}`, params);
  }

  async updateProfile(userId: string, profileData: Partial<User>) {
    return this.patch(userId, profileData);
  }

  async activateUser(userId: string) {
    return this.patch(userId, { isActive: true });
  }

  async deactivateUser(userId: string) {
    return this.patch(userId, { isActive: false });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    return this.post(`/${userId}/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  async uploadProfileImage(userId: string, imageFile: File) {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    // For multipart form data, we need to use the underlying axios instance
    const response = await apiClient.getAxiosInstance().post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  }

  // Override getAll to use user-specific query params
  async getAll(params?: UserQueryParams) {
    return super.getAll(params);
  }

  // Override create to add validation
  async create(data: CreateData<User>) {
    // Add any user-specific validation here
    if (!data.email || !data.firstName || !data.lastName) {
      throw new Error('Email, firstName, and lastName are required');
    }
    
    return super.create(data);
  }
}

// Create and export a singleton instance
export const userService = new UserService(); 