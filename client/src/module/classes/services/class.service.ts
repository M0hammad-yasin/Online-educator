// client/src/module/classes/services/class.service.ts

import { BaseService } from '../../../services/api/base.service';
import { 
  Class, 
  CreateClassRequest, 
  UpdateClassRequest, 
  ClassFilters, 
  ClassCountByGroup, 
  ClassSelection, 
  ClassCount, 
  GroupedClass, 
  CalendarClass 
} from '../types/class.type';
import { ApiResponse, PaginatedResponse } from '../../../services/api/types';

class ClassService extends BaseService<Class> {
  constructor() {
    super('/class');
  }

  async createClass(data: CreateClassRequest): Promise<ApiResponse<Class>> {
    return this.customPost<Class>('/create', data);
  }

  async getAllClasses(filters?: ClassFilters): Promise<PaginatedResponse<Class>> {
    return this.getAll(filters);
  }

  async getClassesForSelection(filters: ClassFilters): Promise<PaginatedResponse<ClassSelection>> {
    return this.customGet<ClassSelection>('/select',filters);
  }

  async getClassesCountByGroup(params: ClassCountByGroup): Promise<ApiResponse<any>> {
    return this.customGet<any>('/count-by-group', params);
  }

  async getGroupedClasses(filters?: ClassFilters): Promise<ApiResponse<GroupedClass>> {
    return this.customGet<GroupedClass>('/group', filters);
  }

  async getCalendarClasses(filters?: ClassFilters): Promise<ApiResponse<CalendarClass[]>> {
    return this.customGet<CalendarClass[]>('/calander-view', filters);
  }

  async getClassesCount(filters?: ClassFilters): Promise<ApiResponse<Number>> {

    const response = await this.customGet<Number>('/count', filters);
    console.log("response : ",response.data);
    return response;
  }

  async getClassById(id: string): Promise<ApiResponse<Class>> {
    return this.getById(id);
  }

  async updateClass(id: string, data: UpdateClassRequest): Promise<ApiResponse<Class>> {
    return this.update(id, data);
  }

  async deleteClass(id: string): Promise<ApiResponse<void>> {
    return this.delete(id);
  }
}

export const classService = new ClassService();