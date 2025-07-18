// src/module/student/services/student.service.ts

import { BaseService } from '../../../services/api/base.service';
import { ResponseTransformer } from '../../../services/api/response-transformer';
import { ApiResponse, PaginatedResponse } from '../../../services/api/types';
import {
  Student,
  StudentWithClasses,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentFilters,
  StudentForSelection,
  StudentCount,
  GroupedStudent,
} from '../types/student.types';

class StudentService extends BaseService<Student> {
  constructor() {
    super('/student');
  }

  // Get all students with filtering and pagination
  async getAllStudents(filters: StudentFilters = {}): Promise<PaginatedResponse<Student>> {
    const params = this.buildQueryParams(filters);
    const response = await this.getAll(params);
    return ResponseTransformer.transformPaginatedResponse(response);
  }

  // Get single student by ID
  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    const response = await this.getById(`/${id}`);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Create new student (Admin/Moderator only)
  async createStudent(data: CreateStudentRequest): Promise<ApiResponse<Student>> {
    const response = await this.customPost<ApiResponse<Student>>('/register', data);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Update student (Admin/Moderator/Teacher or self)
  async updateStudent(id: string, data: UpdateStudentRequest): Promise<ApiResponse<Student>> {
    const response = await this.customPatch<ApiResponse<Student>>(`/${id}`, data);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Update own profile (Student only)
  async updateOwnProfile(data: UpdateStudentRequest): Promise<ApiResponse<Student>> {
    const response = await this.customPatch<ApiResponse<Student>>('/me/update', data);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Delete student (Admin/Moderator only)
  async deleteStudent(id: string): Promise<ApiResponse<void>> {
    const response = await this.delete(`/${id}`);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Get students for selection dropdowns
  async getStudentsForSelection(filters: StudentFilters = {}): Promise<PaginatedResponse<StudentForSelection>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<PaginatedResponse<StudentForSelection>>('/select', params);
    return ResponseTransformer.transformPaginatedResponse(response);
  }

  // Get students with their classes
  async getStudentsWithClasses(filters: StudentFilters = {}): Promise<PaginatedResponse<StudentWithClasses>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<PaginatedResponse<StudentWithClasses>>('/classes', params);
    return ResponseTransformer.transformPaginatedResponse(response);
  }

  // Get student statistics
  async getStudentCount(filters: StudentFilters = {}): Promise<ApiResponse<StudentCount>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<ApiResponse<StudentCount>>('/count', params);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Get grouped students
  async getGroupedStudents(filters: StudentFilters = {}): Promise<ApiResponse<GroupedStudent>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<ApiResponse<GroupedStudent>>('/group', params);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Get current student profile (for authenticated student)
  async getCurrentStudentProfile(): Promise<ApiResponse<Student>> {
    const response = await this.customGet<ApiResponse<Student>>('/me');
    return ResponseTransformer.transformApiResponse(response);
  }

  // Helper method to build query parameters
  private buildQueryParams(filters: StudentFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    return params;
  }
}

// Export singleton instance
export const studentService = new StudentService();
export default studentService;