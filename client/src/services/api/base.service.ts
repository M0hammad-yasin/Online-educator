// client/src/services/api/base.service.ts

import { AxiosRequestConfig } from 'axios';
import { apiClient } from './client';
import { ApiResponse, QueryParams, BaseEntity } from './types';
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
        if (typeof value === "object") {
          // For arrays or objects
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  async getAll(params?: QueryParams): Promise<ApiResponse<T[]>> {
    const response = await apiClient.get(this.buildUrl('', params));
    return ResponseTransformer.transformApiResponse(response.data);
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
  async put(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.put(this.buildUrl(`/${id}`), data);
    return ResponseTransformer.transformApiResponse<T>(response.data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(this.buildUrl(`/${id}`));
    return ResponseTransformer.transformApiResponse<void>(response.data);
  }

  // Method for custom GET requests
  protected async customGet<R>(
    path: string,
    params?: QueryParams
  ): Promise<ApiResponse<R>> {
    const response = await apiClient.get(this.buildUrl(path, params));
    return ResponseTransformer.transformApiResponse<R>(response.data);
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
  protected async customPut<R>(
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<R>> {
    const response = await apiClient.put(this.buildUrl(path), data, config);
    return ResponseTransformer.transformApiResponse<R>(response.data);
  }
}