// src/module/student/services/student.service.ts

import { BaseService } from '../../../services/api/base.service';
import { ApiResponse } from '../../../services/api/types';
import {
  Student,
  StudentWithClasses,
  CreateStudentRequest,
  UpdateStudentRequest,
  StudentFilters,
  StudentForSelection,
  StudentCount,
  GroupedStudent,
  StudentSearchResult,
} from '..';

class StudentService extends BaseService<Student> {
  constructor() {
    super('/student');
  }

  // Get all students with filtering and pagination
  async getAllStudents(filters: StudentFilters = {}): Promise<ApiResponse<Student[]>> {
     return this.getAll(filters);
  }

  // Get single student by ID
  async getStudentById(id: string): Promise<ApiResponse<Student>> {
    return this.getById(`/${id}`);
  }

  // Create new student (Admin/Moderator only)
  async createStudent(data: CreateStudentRequest): Promise<ApiResponse<Student>> {
    return this.create(data);
  }

  // Update student (Admin/Moderator/Teacher or self)
  async updateStudent(id: string, data: UpdateStudentRequest): Promise<ApiResponse<Student>> {
    return this.put(`/${id}`, data);
  }

  // Update own profile (Student only)
  async updateOwnProfile(data: UpdateStudentRequest): Promise<ApiResponse<Student>> {
    return this.patch('/me', data);
  }

  // Delete student (Admin/Moderator only)
  async deleteStudent(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/${id}`);
  }

  // Get students for selection dropdowns
  async getStudentsForSelection(filters: StudentFilters = {}): Promise<ApiResponse<StudentForSelection[]>> {
    return this.customGet<StudentForSelection[]>('/select', filters);
  }

  // Get students with their classes
  async getStudentsWithClasses(filters: StudentFilters = {}): Promise<ApiResponse<StudentWithClasses[]>> {
    return this.customGet<StudentWithClasses[]>('/classes', filters);
  }

  // Get student statistics
  async getStudentCount(filters: StudentFilters = {}): Promise<ApiResponse<StudentCount>> {
    return this.customGet<StudentCount>('/count', filters);
  }

  // Get grouped students
  async getGroupedStudents(filters: StudentFilters = {}): Promise<ApiResponse<GroupedStudent>> {
    return this.customGet<GroupedStudent>('/group', filters);
  }

  // Get current student profile (for authenticated student)
  async getCurrentStudentProfile(): Promise<ApiResponse<Student>> {
    return this.customGet<Student>('/me');
  }
  async searchStudents(filters:StudentFilters): Promise<ApiResponse<StudentSearchResult[]>> {
    return this.customGet<StudentSearchResult[]>('/search', filters);
  }

}

// Export singleton instance
export const studentService = new StudentService();
export default studentService;