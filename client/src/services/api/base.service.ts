// client/src/services/api/base.service.ts

import { AxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { ApiResponse, PaginatedResponse, QueryParams, BaseEntity } from './types';
import { ResponseTransformer } from './response-transformer';

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
    const response = await apiClient.get(this.buildUrl('', params));
    return ResponseTransformer.transformPaginatedResponse<T>(response.data);
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    const response = await apiClient.get(this.buildUrl(`/${id}`));
    return ResponseTransformer.transformApiResponse<T>(response.data);
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.post(this.endpoint, data);
    return ResponseTransformer.transformApiResponse<T>(response.data);
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.put(this.buildUrl(`/${id}`), data);
    return ResponseTransformer.transformApiResponse<T>(response.data);
  }

  async patch(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.patch(this.buildUrl(`/${id}`), data);
    return ResponseTransformer.transformApiResponse<T>(response.data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(this.buildUrl(`/${id}`));
    return ResponseTransformer.transformApiResponse<void>(response.data);
  }

  // Overloads for customGet based on pagination params
  protected async customGet<R>(
    path: string,
    params: QueryParams
  ): Promise<PaginatedResponse<R>>;
  protected async customGet<R>(
    path: string,
    params?: QueryParams
  ): Promise<ApiResponse<R>>;
  protected async customGet<R>(
    path: string,
    params?: QueryParams
  ): Promise<ApiResponse<R> | PaginatedResponse<R>> {
    const response = await apiClient.get(this.buildUrl(path, params));
    if (params && (params.page !== undefined || params.limit !== undefined)) {
      return ResponseTransformer.transformPaginatedResponse<R>(response.data);
    } else {
      return ResponseTransformer.transformApiResponse<R>(response.data);
    }
  }

  protected async customPost<R>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    const response = await apiClient.post(this.buildUrl(path), data, config);
    return ResponseTransformer.transformApiResponse<R>(response.data);
  }

  protected async customPatch<R>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    const response = await apiClient.patch(this.buildUrl(path), data, config);
    return ResponseTransformer.transformApiResponse<R>(response.data);
  }
}