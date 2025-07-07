import { BaseApiService, BaseEntity, CreateData, UpdateData } from './baseApiService';
import { apiClient } from './apiClient';

// Class entity interface
export interface Class extends BaseEntity {
  name: string;
  description: string;
  teacherId: string;
  subject: string;
  grade: string;
  maxStudents: number;
  currentStudents: number;
  startDate: string;
  endDate: string;
  schedule: ClassSchedule[];
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  price: number;
  currency: string;
  location: 'online' | 'offline' | 'hybrid';
  meetingLink?: string;
  address?: string;
}

// Class schedule interface
export interface ClassSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
  timezone: string;
}

// Class-specific query parameters
export interface ClassQueryParams {
  teacherId?: string;
  subject?: string;
  grade?: string;
  status?: Class['status'];
  location?: Class['location'];
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'name' | 'startDate' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

// Class service class
export class ClassService extends BaseApiService<Class> {
  constructor() {
    super({
      endpoint: '/classes',
      transformResponse: (data: any) => ({
        ...data,
        // Add computed properties
        isFull: data.currentStudents >= data.maxStudents,
        availableSpots: data.maxStudents - data.currentStudents,
        duration: this.calculateDuration(data.startDate, data.endDate),
      }),
    });
  }

  // Helper method to calculate class duration
  private calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  }

  // Class-specific methods
  async getByTeacher(teacherId: string, params?: ClassQueryParams) {
    return this.get(`/teacher/${teacherId}`, params);
  }

  async getBySubject(subject: string, params?: ClassQueryParams) {
    return this.get(`/subject/${subject}`, params);
  }

  async getByGrade(grade: string, params?: ClassQueryParams) {
    return this.get(`/grade/${grade}`, params);
  }

  async getActiveClasses(params?: ClassQueryParams) {
    return this.get('/active', params);
  }

  async enrollStudent(classId: string, studentId: string) {
    return this.post(`/${classId}/enroll`, { studentId });
  }

  async unenrollStudent(classId: string, studentId: string) {
    return this.post(`/${classId}/unenroll`, { studentId });
  }

  async getEnrolledStudents(classId: string) {
    return this.get(`/${classId}/students`);
  }

  async updateSchedule(classId: string, schedule: ClassSchedule[]) {
    return this.patch(classId, { schedule });
  }

  async activateClass(classId: string) {
    return this.patch(classId, { status: 'active' });
  }

  async deactivateClass(classId: string) {
    return this.patch(classId, { status: 'inactive' });
  }

  async completeClass(classId: string) {
    return this.patch(classId, { status: 'completed' });
  }

  async cancelClass(classId: string, reason?: string) {
    return this.patch(classId, { 
      status: 'cancelled',
      // Note: cancellationReason would need to be added to the Class interface
      // For now, we'll just update the status
    });
  }

  async searchClasses(searchTerm: string, params?: ClassQueryParams) {
    return this.get('/search', { ...params, search: searchTerm });
  }

  async getClassesByPriceRange(minPrice: number, maxPrice: number, params?: ClassQueryParams) {
    return this.get('/price-range', { ...params, minPrice, maxPrice });
  }

  async getUpcomingClasses(days: number = 30, params?: ClassQueryParams) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.get('/upcoming', { 
      ...params, 
      endDate: futureDate.toISOString() 
    });
  }

  async getPopularClasses(limit: number = 10) {
    return this.get('/popular', { limit, sort: 'currentStudents', order: 'desc' });
  }

  async uploadClassMaterial(classId: string, file: File, description?: string) {
    const formData = new FormData();
    formData.append('material', file);
    if (description) {
      formData.append('description', description);
    }
    
    const response = await apiClient.getAxiosInstance().post(
      `/classes/${classId}/materials`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  // Override getAll to use class-specific query params
  async getAll(params?: ClassQueryParams) {
    return super.getAll(params);
  }

  // Override create to add validation
  async create(data: CreateData<Class>) {
    // Add class-specific validation
    if (!data.name || !data.teacherId || !data.subject || !data.grade) {
      throw new Error('Name, teacherId, subject, and grade are required');
    }
    
    if (data.maxStudents && data.maxStudents <= 0) {
      throw new Error('Max students must be greater than 0');
    }
    
    if (data.price && data.price < 0) {
      throw new Error('Price cannot be negative');
    }
    
    return super.create(data);
  }

  // Override update to add validation
  async update(id: string, data: UpdateData<Class>) {
    // Add update validation
    if (data.maxStudents && data.currentStudents && data.maxStudents < data.currentStudents) {
      throw new Error('Max students cannot be less than current students');
    }
    
    return super.update(id, data);
  }
}

// Create and export a singleton instance
export const classService = new ClassService(); 