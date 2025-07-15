export interface ApiResponse<T = any> {
  data: T;
  isSuccess: boolean;
  message?: string;
  error?: ApiErrorResponse|string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  error?:ApiErrorResponse|string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isSuccess: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  type: string;
  message: string;
  stack?: string;
}

export class ApiError extends Error {
  type: string;
  stack?: string;
  constructor(message: string, type: string, stack?: string) {
    super(message);
    this.type = type;
    this.stack = stack;
  }
} 