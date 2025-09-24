
import { ApiResponse, PaginatedResponse } from './types';

export class ResponseTransformer {
  /**
   * Transform nested server response to flat client format
   * Extracts the actual data from nested structure
   */
  static transformApiResponse<T>(serverResponse: any): ApiResponse<T> {
    const { data, error, isSuccess } = serverResponse;
  
    // If data is an object with a single key, extract that value
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const keys = Object.keys(data);
      if (keys.length === 1) {
        return {
          data: data[keys[0]],
          error,
          isSuccess,
        };
      }
    }
    
    return {
      data,
      error,
      isSuccess,
    };
  }

  /**
   * Transform paginated server response to client format
   */
  static transformPaginatedResponse<T>(serverResponse: any): PaginatedResponse<T> {
    const { data, isSuccess, metaData } = serverResponse;
    
    let transformedData: T[] = [];
    
    // Extract array data from nested structure
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const keys = Object.keys(data);
      const arrayKey = keys.find(key => Array.isArray(data[key]));
      if (arrayKey) {
        transformedData = data[arrayKey];
      }
    } else if (Array.isArray(data)) {
      transformedData = data;
    }

    return {
      data: transformedData,
      pagination: {
        page: metaData?.paginationData?.currentPage || 1,
        limit: metaData?.paginationData?.pageSize || 20,
        total: metaData?.paginationData?.total || 0,
        totalPages: Math.ceil((metaData?.paginationData?.total || 0) / (metaData?.paginationData?.pageSize || 20))
      },
      isSuccess
    };
  }

  /**
   * Auto-detect and transform response based on structure
   */
  static autoTransform<T>(serverResponse: any): ApiResponse<T> | PaginatedResponse<T> {
    const { data, metaData } = serverResponse;
    
    // Check if it's a paginated response
    if (metaData?.paginationData) {
      return this.transformPaginatedResponse<T>(serverResponse);
    }
    
    // Check if data contains an array (likely paginated without explicit pagination)
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      const keys = Object.keys(data);
      const arrayKey = keys.find(key => Array.isArray(data[key]));
      if (arrayKey) {
        return this.transformPaginatedResponse<T>(serverResponse);
      }
    }
    
    // Default to single response transformation
    return this.transformApiResponse<T>(serverResponse);
  }
}