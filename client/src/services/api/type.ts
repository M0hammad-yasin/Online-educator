// // client/src/services/api/types.ts

// export interface ApiResponse<T = any> {
//     data: T;
//     error: string | null;
//     isSuccess: boolean;
//     metaData?: any;
//   }
  
//   export interface PaginatedResponse<T = any> {
//     data: {
//       [key: string]: T[]; // This allows for dynamic keys like "classes", "teachers", etc.
//     };
//     error: string | null;
//     isSuccess: boolean;
//     metaData: {
//       filter?: any;
//       paginationData: {
//         total: number;
//         range: string;
//         currentPage: number;
//         pageSize: number;
//       };
//     };
//   }
  
//   // Specific response types for different endpoints
//   export interface ClassListResponse {
//     data: {
//       classes: Class[];
//     };
//     error: string | null;
//     isSuccess: boolean;
//     metaData: {
//       filter?: any;
//       paginationData: {
//         total: number;
//         range: string;
//         currentPage: number;
//         pageSize: number;
//       };
//     };
//   }
  
//   export interface SingleClassResponse {
//     data: {
//       class: Class;
//     };
//     error: string | null;
//     isSuccess: boolean;
//     metaData: any;
//   }
  
//   export interface UpdatedTeacherResponse {
//     data: {
//       updatedTeacher: Teacher;
//     };
//     error: string | null;
//     isSuccess: boolean;
//     metaData: any;
//   }
  
//   export interface QueryParams {
//     page?: number;
//     limit?: number;
//     sort?: string;
//     order?: 'asc' | 'desc';
//     search?: string;
//     [key: string]: any;
//   }
  
//   export interface BaseEntity {
//     id: string;
//     createdAt: string;
//     updatedAt: string;
//   }
  
//   export interface ApiErrorResponse {
//     type: string;
//     message: string;
//     stack?: string;
//   }
  
//   export class ApiError extends Error {
//     type: string;
//     stack?: string;
//     constructor(message: string, type: string, stack?: string) {
//       super(message);
//       this.type = type;
//       this.stack = stack;
//     }
//   }