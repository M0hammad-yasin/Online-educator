// src/module/teacher/services/teacherStatistics.service.ts

import { BaseService } from '../../../services/api/base.service';
import { ApiResponse, PaginatedResponse } from '../../../services/api/types';
import { Teacher } from '../types';
import { TeacherFilters } from '../types/teacher.types';

interface TeacherWithClassCount {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  _count: {
    classes: number;
  };
}

interface TeacherClassDayCount {
  teacherName: string;
  classCount: number;
}

interface TeacherSummary {
  totalTeachers: number;
  activeTeachers: number;
  totalClasses: number;
  avgClassesPerDay: number;
  pendingVerifications: number;
}

class TeacherStatisticsService extends BaseService<Teacher> {
  constructor() {
    super('/teacher');
  }

  // Get teachers with their class count
  async getTeachersWithClassCount(filters: TeacherFilters = {}): Promise<PaginatedResponse<TeacherWithClassCount>> {
    return this.customGet<TeacherWithClassCount>('/class-count', filters);
  }

  // Get teacher class count for a specific day
  async getTeacherClassCountForDay(date?: string): Promise<ApiResponse<TeacherClassDayCount[]>> {
    const params = date ? { date } : { date: new Date().toISOString().split('T')[0] };
    return this.customPost<TeacherClassDayCount[]>('/class-day-count', params);
  }

  // Get teacher summary (calculated from various endpoints)
  async getTeacherSummary(filters: TeacherFilters = {}): Promise<ApiResponse<TeacherSummary>> {
    // This is a derived summary - we'll calculate it on the frontend
    // by combining data from multiple endpoints
    try {
      const [teachersRes, classCountRes] = await Promise.all([
        this.getAll(filters),
        this.customGet<TeacherWithClassCount>('/class-count', filters),
      ]);
console.log(teachersRes);
      const totalTeachers = teachersRes.pagination?.totalItems || 0;
      const teachers = classCountRes.data || [];
      const totalClasses = teachers.reduce((sum, t) => sum + (t._count?.classes || 0), 0);
      const activeTeachers = teachers.filter(t => (t._count?.classes || 0) > 0).length;
      const pendingVerifications=teachersRes.data.reduce((sum, t) => sum + (t.isEmailVerified ? 0 : 1), 0);
      return {
        isSuccess: true,
        message: 'Summary fetched',
        data: {
          totalTeachers,
          activeTeachers,
          totalClasses,
          avgClassesPerDay: totalTeachers > 0 ? totalClasses / totalTeachers : 0,
          pendingVerifications,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export const teacherStatisticsService = new TeacherStatisticsService();
export default teacherStatisticsService;
