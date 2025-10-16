import { ClassOrderBy } from "../../module/classes";

/**
 * Standardized API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  // Pagination is returned at the top-level response when applicable
  pagination?: PaginationDetails;
  error?: ApiErrorResponse;
}
/**
 * Pagination details interface
 */
export interface PaginationDetails {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  filter?: Record<string, any>;
}
export interface PaginatedResponse<T = any> {
  data: T[];
  error?:ApiErrorResponse|string;
  pagination: PaginationDetails,
  isSuccess: boolean;
}

/**
 * Query parameters interface
 */
export interface QueryParams {
  page?: number;
  limit?: number;
  orderBy?: ClassOrderBy;
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