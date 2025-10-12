// src/module/admin/services/access-control.service.ts

import { apiClient } from '../../../services/api/client';
import { ApiResponse } from '../../../services/api/types';
import { ResponseTransformer } from '../../../services/api/response-transformer';

interface AccessControl {
  canSeeClass?: boolean;
  canAddClass?: boolean;
  canUpdateClass?: boolean;
  canDeleteClass?: boolean;
}

class AccessControlService {
  private baseURL = '/teacher';

  // Get access control for a teacher
  async getAccessControl(teacherId: string): Promise<ApiResponse<AccessControl>> {
    const response = await apiClient.get(`${this.baseURL}/${teacherId}/access-control`);
    return ResponseTransformer.transformApiResponse<AccessControl>(response.data);
  }

  // Update access control for a teacher
  async updateAccessControl(
    teacherId: string,
    data: Partial<AccessControl>
  ): Promise<ApiResponse<AccessControl>> {
    const response = await apiClient.put(`${this.baseURL}/${teacherId}/access-control`, data);
    return ResponseTransformer.transformApiResponse<AccessControl>(response.data);
  }
}

export const accessControlService = new AccessControlService();
export default accessControlService;
