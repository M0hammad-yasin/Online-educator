
import { ApiResponse } from './types';

// With the new unified API format, the client should consume responses directly.
// This class is kept for backward compatibility but now acts as a passthrough.
export class ResponseTransformer {
  static transformApiResponse<T>(serverResponse: any): ApiResponse<T> {
    return serverResponse as ApiResponse<T>;
  }

  static transformPaginatedResponse<T>(serverResponse: any): ApiResponse<T[]> {
    return serverResponse as ApiResponse<T[]>;
  }

  static autoTransform<T>(serverResponse: any): ApiResponse<T> {
    return serverResponse as ApiResponse<T>;
  }
}

