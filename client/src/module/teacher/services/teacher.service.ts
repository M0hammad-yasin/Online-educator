// src/module/teacher/services/teacher.service.ts

import { BaseService } from '../../../services/api/base.service';
import { ApiResponse } from '../../../services/api/types';
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
  async getAllTeachers(filters: TeacherFilters = {}): Promise<ApiResponse<Teacher[]>> {
    return this.getAll(filters);  
  }

  // Get single teacher by ID
  async getTeacherById(id: string): Promise<ApiResponse<Teacher>> {
    return this.getById(id);
  }

  // Create new teacher (Admin/Moderator only)
  async createTeacher(data: CreateTeacherRequest): Promise<ApiResponse<Teacher>> {
    return this.customPost<Teacher>('/register', data);
  }

  // Update teacher (Admin/Moderator or self)
  async updateTeacher(id: string, data: UpdateTeacherRequest): Promise<ApiResponse<Teacher>> {
    return this.update(id, data);
  }

  // Update own profile (Teacher only)
  async updateOwnProfile(data: UpdateTeacherRequest): Promise<ApiResponse<Teacher>> {
    return this.customPatch<Teacher>('/me/update', data);
  }

  // Delete teacher (Admin/Moderator only)
  async deleteTeacher(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  // Get teachers for selection dropdowns
  async getTeachersForSelection(filters: TeacherFilters = {}): Promise<ApiResponse<TeacherForSelection[]>> {
    return this.customGet<TeacherForSelection[]>('/select', filters);
  }

  // Get teachers with their classes
  async getTeachersWithClasses(filters: TeacherFilters = {}): Promise<ApiResponse<TeacherWithClasses[]>> {
    return this.customGet<TeacherWithClasses[]>('/classes', filters);
  }

  // // Get teacher statistics
  // async getTeacherCount(filters: TeacherFilters = {}): Promise<ApiResponse<TeacherCount>> {
  //   return this.customGet<TeacherCount>('/count', filters);
  // }

  // // Get grouped teachers
  // async getGroupedTeachers(filters: TeacherFilters = {}): Promise<ApiResponse<GroupedTeacher>> {
  //   return this.customGet<GroupedTeacher>('/group', filters);
  // }

  // Get current teacher profile (for authenticated teacher)
  async getCurrentTeacherProfile(): Promise<ApiResponse<Teacher>> {
    return this.customGet('/me');
  }
}

const teacherService = new TeacherService();
export default teacherService;