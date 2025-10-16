// src/module/admin/services/access-control.service.ts

import { ApiResponse } from '../../../services/api/types';
import { BaseService } from '../../../services/api/base.service';

interface AccessControl {
  canSeeClass?: boolean;
  canAddClass?: boolean;
  canUpdateClass?: boolean;
  canDeleteClass?: boolean;
}

// Extend BaseEntity shape to satisfy BaseService generic constraint
type TeacherAccessControlEntity = AccessControl & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

class AccessControlService extends BaseService<TeacherAccessControlEntity> {
  constructor() {
    super('/teacher');
  }

  // Get access control for a teacher
  async getAccessControl(teacherId: string): Promise<ApiResponse<AccessControl>> {
    return this.customGet<AccessControl>(`/${teacherId}/access-control`);
  }

  // Update access control for a teacher
  async updateAccessControl(
    teacherId: string,
    data: Partial<AccessControl>
  ): Promise<ApiResponse<AccessControl>> {
    return this.customPut<AccessControl>(`/${teacherId}/access-control`, data,{params:{
      model: 'teacher',
      canSeeClass: data.canSeeClass,
      canAddClass: data.canAddClass,
      canUpdateClass: data.canUpdateClass,
      canDeleteClass: data.canDeleteClass,
    }});
  }
}

export const accessControlService = new AccessControlService();
export default accessControlService;
