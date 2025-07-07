import { AxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { ApiResponse, PaginatedResponse, QueryParams, BaseEntity } from './types';

export abstract class BaseService<T extends BaseEntity> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  private buildUrl(path: string = '', params?: QueryParams): string {
    const url = `${this.endpoint}${path}`;
    
    if (!params) return url;
    
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(
      this.buildUrl('', params)
    );
    return response.data;
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(
      this.buildUrl(`/${id}`)
    );
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(
      this.endpoint,
      data
    );
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(
      this.buildUrl(`/${id}`),
      data
    );
    return response.data;
  }

  async patch(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.patch<ApiResponse<T>>(
      this.buildUrl(`/${id}`),
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      this.buildUrl(`/${id}`)
    );
    return response.data;
  }

  protected async customGet<R>(
    path: string,
    params?: QueryParams
  ): Promise<ApiResponse<R>> {
    const response = await apiClient.get<ApiResponse<R>>(
      this.buildUrl(path, params)
    );
    return response.data;
  }

  protected async customPost<R>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    const response = await apiClient.post<ApiResponse<R>>(
      this.buildUrl(path),
      data,
      config
    );
    return response.data;
  }
} 