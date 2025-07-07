import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export class ApiError extends Error {
  public status: number;
  public data: any;
  public isNetworkError: boolean;

  constructor(message: string, status: number = 0, data: any = null, isNetworkError: boolean = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isNetworkError = isNetworkError;
  }
}

// Configuration interface
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

// Token management
export interface TokenManager {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
}

// Default token manager using localStorage
export const defaultTokenManager: TokenManager = {
  getToken: () => localStorage.getItem('accessToken'),
  setToken: (token: string) => localStorage.setItem('accessToken', token),
  removeToken: () => localStorage.removeItem('accessToken'),
};

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private tokenManager: TokenManager;

  constructor(config: ApiClientConfig, tokenManager: TokenManager = defaultTokenManager) {
    this.tokenManager = tokenManager;
    
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: config.withCredentials || false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.tokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Transform successful responses
        return this.transformResponse(response);
      },
      (error: AxiosError) => {
        // Handle errors
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private transformResponse(response: AxiosResponse): AxiosResponse {
    // If the response has a data property with success field, use it
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      return {
        ...response,
        data: response.data,
      };
    }

    // Otherwise, wrap the response in a standard format
    return {
      ...response,
      data: {
        success: true,
        data: response.data,
        statusCode: response.status,
      },
    };
  }

  private handleError(error: AxiosError): ApiError {
    if (error.code === 'ECONNABORTED') {
      return new ApiError('Request timeout', 408, null, true);
    }

    if (!error.response) {
      return new ApiError('Network error', 0, null, true);
    }

    const { status, data } = error.response;
    let message = 'An error occurred';

    if (data && typeof data === 'object') {
      message = (data as any).message || (data as any).error || message;
    }

    // Handle specific status codes
    switch (status) {
      case 401:
        this.tokenManager.removeToken();
        message = 'Authentication required';
        break;
      case 403:
        message = 'Access forbidden';
        break;
      case 404:
        message = 'Resource not found';
        break;
      case 422:
        message = 'Validation error';
        break;
      case 500:
        message = 'Internal server error';
        break;
    }

    return new ApiError(message, status, data);
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Utility methods
  setToken(token: string): void {
    this.tokenManager.setToken(token);
  }

  removeToken(): void {
    this.tokenManager.removeToken();
  }

  getToken(): string | null {
    return this.tokenManager.getToken();
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  // Get the underlying axios instance (for advanced use cases)
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create default API client instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

export default apiClient; 