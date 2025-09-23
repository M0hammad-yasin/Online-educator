// src/module/teacher/services/teacher.service.ts

import { BaseService } from '../../../services/api/base.service';
import { ResponseTransformer } from '../../../services/api/response-transformer';
import { ApiResponse, PaginatedResponse } from '../../../services/api/types';
import {
  Teacher,
  TeacherWithClasses,
  CreateTeacherRequest,
  UpdateTeacherRequest,
  TeacherFilters,
  TeacherForSelection,
  TeacherCount,
  GroupedTeacher,
} from '../types/teacher.types';

class TeacherService extends BaseService<Teacher> {
  constructor() {
    super('/teacher');
  }

  // Get all teachers with filtering and pagination
  async getAllTeachers(filters: TeacherFilters = {}): Promise<PaginatedResponse<Teacher>> {
    const params = this.buildQueryParams(filters);
    const response = await this.getAll(params);
    return ResponseTransformer.transformPaginatedResponse(response);
  }

  // Get single teacher by ID
  async getTeacherById(id: string): Promise<ApiResponse<Teacher>> {
    const response = await this.getById(`/${id}`);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Create new teacher (Admin/Moderator only)
  async createTeacher(data: CreateTeacherRequest): Promise<ApiResponse<Teacher>> {
    const response = await this.customPost<ApiResponse<Teacher>>('/register', data);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Update teacher (Admin/Moderator or self)
  async updateTeacher(id: string, data: UpdateTeacherRequest): Promise<ApiResponse<Teacher>> {
    const response = await this.customPatch<ApiResponse<Teacher>>(`/${id}`, data);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Update own profile (Teacher only)
  async updateOwnProfile(data: UpdateTeacherRequest): Promise<ApiResponse<Teacher>> {
    const response = await this.customPatch<ApiResponse<Teacher>>('/me/update', data);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Delete teacher (Admin/Moderator only)
  async deleteTeacher(id: string): Promise<ApiResponse<void>> {
    const response = await this.delete(`/${id}`);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Get teachers for selection dropdowns
  async getTeachersForSelection(filters: TeacherFilters = {}): Promise<PaginatedResponse<TeacherForSelection>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<PaginatedResponse<TeacherForSelection>>('/select', params);
    return ResponseTransformer.transformPaginatedResponse(response);
  }

  // Get teachers with their classes
  async getTeachersWithClasses(filters: TeacherFilters = {}): Promise<PaginatedResponse<TeacherWithClasses>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<PaginatedResponse<TeacherWithClasses>>('/classes', params);
    return ResponseTransformer.transformPaginatedResponse(response);
  }

  // Get teacher statistics
  async getTeacherCount(filters: TeacherFilters = {}): Promise<ApiResponse<TeacherCount>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<ApiResponse<TeacherCount>>('/count', params);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Get grouped teachers
  async getGroupedTeachers(filters: TeacherFilters = {}): Promise<ApiResponse<GroupedTeacher>> {
    const params = this.buildQueryParams(filters);
    const response = await this.customGet<ApiResponse<GroupedTeacher>>('/group', params);
    return ResponseTransformer.transformApiResponse(response);
  }

  // Get current teacher profile (for authenticated teacher)
  async getCurrentTeacherProfile(): Promise<ApiResponse<Teacher>> {
    const response = await this.customGet<ApiResponse<Teacher>>('/me');
    return ResponseTransformer.transformApiResponse(response);
  }

  // Helper method to build query parameters
  private buildQueryParams(filters: TeacherFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
    
    return params;
  }
}

const teacherService = new TeacherService();
export default teacherService;