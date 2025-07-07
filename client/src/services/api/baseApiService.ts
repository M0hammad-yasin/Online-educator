import { apiClient, ApiResponse, PaginatedResponse, ApiError } from './apiClient';

// Common query parameters interface
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Create/Update data interface
export type CreateData<T> = Partial<T>;
export type UpdateData<T> = Partial<T>;

// Service configuration
export interface ServiceConfig {
  endpoint: string;
  transformResponse?: <T>(data: any) => T;
  transformRequest?: <T>(data: T) => any;
}

export abstract class BaseApiService<T extends BaseEntity = BaseEntity> {
  protected endpoint: string;
  protected transformResponse?: <R>(data: any) => R;
  protected transformRequest?: <R>(data: R) => any;

  constructor(config: ServiceConfig) {
    this.endpoint = config.endpoint;
    this.transformResponse = config.transformResponse;
    this.transformRequest = config.transformRequest;
  }

  // Helper method to build URL with query parameters
  protected buildUrl(path: string = '', params?: QueryParams): string {
    const url = `${this.endpoint}${path}`;
    
    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  // Helper method to transform data
  protected transformData<R>(data: any, transformer?: <R>(data: any) => R): R {
    if (transformer) {
      return transformer(data);
    }
    return data as R;
  }

  // CRUD Operations

  // Get all items with pagination
  async getAll(params?: QueryParams): Promise<PaginatedResponse<T[]>> {
    try {
      const response = await apiClient.get<T[]>(
        this.buildUrl('', params)
      );
      
      if (response.success && response.data && Array.isArray(response.data)) {
        const transformedData = response.data.map(item => 
          this.transformData<T>(item, this.transformResponse)
        );
        
        return {
          ...response,
          data: transformedData,
        };
      }
      
      return response as PaginatedResponse<T[]>;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Get item by ID
  async getById(id: string): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<T>(
        this.buildUrl(`/${id}`)
      );
      
      if (response.success && response.data) {
        const transformedData = this.transformData<T>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedData,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Create new item
  async create(data: CreateData<T>): Promise<ApiResponse<T>> {
    try {
      const transformedData = this.transformRequest ? 
        this.transformRequest(data) : data;
      
      const response = await apiClient.post<T>(
        this.endpoint,
        transformedData
      );
      
      if (response.success && response.data) {
        const transformedResponse = this.transformData<T>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedResponse,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Update item by ID
  async update(id: string, data: UpdateData<T>): Promise<ApiResponse<T>> {
    try {
      const transformedData = this.transformRequest ? 
        this.transformRequest(data) : data;
      
      const response = await apiClient.put<T>(
        this.buildUrl(`/${id}`),
        transformedData
      );
      
      if (response.success && response.data) {
        const transformedResponse = this.transformData<T>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedResponse,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Partial update item by ID
  async patch(id: string, data: UpdateData<T>): Promise<ApiResponse<T>> {
    try {
      const transformedData = this.transformRequest ? 
        this.transformRequest(data) : data;
      
      const response = await apiClient.patch<T>(
        this.buildUrl(`/${id}`),
        transformedData
      );
      
      if (response.success && response.data) {
        const transformedResponse = this.transformData<T>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedResponse,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Delete item by ID
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<void>(
        this.buildUrl(`/${id}`)
      );
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Custom GET request
  async get<R = any>(path: string = '', params?: QueryParams): Promise<ApiResponse<R>> {
    try {
      const response = await apiClient.get<R>(
        this.buildUrl(path, params)
      );
      
      if (response.success && response.data) {
        const transformedData = this.transformData<R>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedData,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Custom POST request
  async post<R = any>(path: string = '', data?: any): Promise<ApiResponse<R>> {
    try {
      const transformedData = this.transformRequest ? 
        this.transformRequest(data) : data;
      
      const response = await apiClient.post<R>(
        this.buildUrl(path),
        transformedData
      );
      
      if (response.success && response.data) {
        const transformedResponse = this.transformData<R>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedResponse,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Custom PUT request
  async put<R = any>(path: string = '', data?: any): Promise<ApiResponse<R>> {
    try {
      const transformedData = this.transformRequest ? 
        this.transformRequest(data) : data;
      
      const response = await apiClient.put<R>(
        this.buildUrl(path),
        transformedData
      );
      
      if (response.success && response.data) {
        const transformedResponse = this.transformData<R>(response.data, this.transformResponse);
        return {
          ...response,
          data: transformedResponse,
        };
      }
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Custom DELETE request
  async deleteCustom<R = any>(path: string = ''): Promise<ApiResponse<R>> {
    try {
      const response = await apiClient.delete<R>(
        this.buildUrl(path)
      );
      
      return response;
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  // Error handling
  protected handleServiceError(error: any): ApiError {
    if (error instanceof ApiError) {
      return error;
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      return new ApiError(error.message, 0, null, true);
    }
    
    return new ApiError('Unknown error occurred', 0, null, true);
  }

  // Utility methods
  protected getEndpoint(): string {
    return this.endpoint;
  }

  protected setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }
} 