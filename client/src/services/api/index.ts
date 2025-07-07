// Export API client and related types
export { 
  apiClient, 
  ApiClient, 
  defaultTokenManager
} from './apiClient';

export type { 
  ApiResponse, 
  PaginatedResponse, 
  ApiError,
  ApiClientConfig,
  TokenManager
} from './apiClient';

// Export base service and related types
export {
  BaseApiService
} from './baseApiService';

export type {
  QueryParams,
  BaseEntity,
  CreateData,
  UpdateData,
  ServiceConfig
} from './baseApiService';

// Export service instances
export { userService } from './userService';
export { classService } from './classService';

// Export service types
export type { User, UserQueryParams } from './userService';
export type { Class, ClassSchedule, ClassQueryParams } from './classService';

// Export React Query hooks
export * from './hooks';

// Default export for convenience
export { apiClient as default } from './apiClient'; 