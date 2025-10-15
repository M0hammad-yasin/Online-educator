import axios, {  AxiosInstance } from 'axios';
import { ApiError, ApiErrorResponse } from './types';

class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const response = await this.axiosInstance.post('/auth/refresh-token');
            const newToken = response.data.data.accessToken;
            
            if (newToken) {
              localStorage.setItem('accessToken', newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }
        }
        console.error(`API Error (${error.response?.status}):`, error);
        return Promise.reject(this.transformError(error));
      }
    );
  }

  private transformError(error: any): ApiError {
    // If it's an Axios error with a response, extract the server error structure
    if (error?.response?.data) {
      const data = error.response.data?.error as ApiErrorResponse
      return new ApiError(
        data.message || 'An error occurred',
        data.type || 'unknown_error',
        data.stack
      );
    }
    // Fallback for other errors
    return new ApiError(error.message || 'Network error', 'network_error');
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiClient = ApiClient.getInstance().getAxiosInstance(); 