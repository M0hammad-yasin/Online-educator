// src/module/admin/services/access-control.service.ts

import { ApiResponse } from '../../../services/api/types';
import { BaseService } from '../../../services/api/base.service';
import { TeacherAccessControl } from '../../teacher';

// Extend BaseEntity shape to satisfy BaseService generic constraint
type TeacherAccessControlEntity = TeacherAccessControl & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

class AccessControlService extends BaseService<TeacherAccessControlEntity> {
  constructor() {
    super('/teacher');
  }

  // Get access control for a teacher
  async getAccessControl(teacherId: string): Promise<ApiResponse<TeacherAccessControl>> {
    return this.customGet<TeacherAccessControl>(`/${teacherId}/access-control`);
  }

  // Update access control for a teacher
  async updateAccessControl(
    teacherId: string,
    data: Partial<TeacherAccessControl>
  ): Promise<ApiResponse<TeacherAccessControl>> {
    return this.customPut<TeacherAccessControl>(`/${teacherId}/access-control`, data);
  }
}
export const accessControlService = new AccessControlService();
export default accessControlService;
