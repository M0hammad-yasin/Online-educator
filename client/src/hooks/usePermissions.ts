import { useMemo } from 'react';
import useRole from './useRole';
import { useAuthStore } from '../module/authentication';
import { ModelName, PermissionContext, UserPermissions } from '../config/rbac-types';
import {
  canViewField,
  canEditField,
  getAllowedViewFields as getAllowedViewFieldsUtil,
  getAllowedEditFields as getAllowedEditFieldsUtil,
  filterRecordFields,
  filterRecords,
  canPerformAction,
} from '../utils/permission-utils';
import { getModelConfig } from '../config/model-permissions.config';

interface UsePermissionsReturn {
  canView: (field: string, record?: any) => boolean;
  canEdit: (field: string, record?: any) => boolean;
  getAllowedViewFields: (record?: any) => string[];
  getAllowedEditFields: (record?: any) => string[];
  filterRecord: <T extends Record<string, any>>(record: T) => Partial<T>;
  filterRecords: <T extends Record<string, any>>(records: T[]) => Partial<T>[];
  canPerformAction: (action: 'view' | 'edit' | 'delete' | 'create') => boolean;
  getContext: (record?: any) => PermissionContext;
}

export function usePermissions(model: ModelName): UsePermissionsReturn {
  const currentRole = useRole();
  const { user } = useAuthStore();
  const modelConfig = useMemo(() => getModelConfig(model), [model]);
  const mapPersmissions = (): UserPermissions | null => {
    let permission: UserPermissions | null = null;
    if (!user.accessControl) return permission;
    const userAccess = user.accessControl;
    switch (model) {
      case 'class':
        permission = {
          create: userAccess.canAddClass,
          view: userAccess.canSeeClass,
          edit: userAccess.canUpdateClass,
          delete: userAccess.canDeleteClass
        }; break;
      case 'student':
        permission = {
          create: userAccess.canAddStudent,
          view: userAccess.canSeeStudent,
          edit: userAccess.canUpdateStudent,
          delete: userAccess.canDeleteStudent
        }; break;
      case 'teacher':
        if ('canAddTeacher' in userAccess)
          permission = {
            create: userAccess.canAddTeacher,
            view: userAccess.canSeeTeacher,
            edit: userAccess.canUpdateTeacher,
            delete: userAccess.canDeleteTeacher
          }; break;
      default: return null;
    }
    return permission;
  }
  const baseContext = useMemo<PermissionContext>(

    () => ({
      role: currentRole,
      userId: user?.id || '',
      permissions: mapPersmissions(),
    }),
    [currentRole, user]
  );

  const getContext = (record?: any): PermissionContext => ({ ...baseContext, record });

  const canView = (field: string, record?: any) =>
    canViewField(field, getContext(record), modelConfig);

  const canEdit = (field: string, record?: any) =>
    canEditField(field, getContext(record), modelConfig);

  const getAllowedViewFields = (record?: any) =>
    getAllowedViewFieldsUtil(getContext(record), modelConfig);

  const getAllowedEditFields = (record?: any) =>
    getAllowedEditFieldsUtil(getContext(record), modelConfig);

  const filterRecord = <T extends Record<string, any>>(record: T) =>
    filterRecordFields(record, getAllowedViewFields(record));

  const filterMultipleRecords = <T extends Record<string, any>>(records: T[]) =>
    filterRecords(records, getAllowedViewFields());

  const canPerform = (action: 'view' | 'edit' | 'delete' | 'create') =>
    canPerformAction(action, baseContext, modelConfig);

  return {
    canView,
    canEdit,
    getAllowedViewFields,
    getAllowedEditFields,
    filterRecord,
    filterRecords: filterMultipleRecords,
    canPerformAction: canPerform,
    getContext,
  }
};