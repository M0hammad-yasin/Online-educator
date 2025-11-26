import { useMemo } from 'react';
import useRole from './useRole';
import { useAuthStore } from '../module/authentication';
import { ModelName, PermissionContext } from '../config/rbac-types';
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

  const baseContext = useMemo<PermissionContext>(
    
    () => ({
      role: currentRole,
      userId: user?.id || '',
      permissions:  [],
    }),
    [currentRole, user]
  );

  const getContext = (record?: any): PermissionContext => ({ ...baseContext, record });

  const canView = (field: string, record?: any) =>
    canViewField( field, getContext(record), modelConfig);

  const canEdit = (field: string, record?: any) =>
    canEditField(field, getContext(record), modelConfig);

  const getAllowedViewFields = (record?: any) =>
    getAllowedViewFieldsUtil( getContext(record), modelConfig);

  const getAllowedEditFields = (record?: any) =>
    getAllowedEditFieldsUtil( getContext(record), modelConfig);

  const filterRecord = <T extends Record<string, any>>(record: T) =>
    filterRecordFields(record, getAllowedViewFields(record));

  const filterMultipleRecords = <T extends Record<string, any>>(records: T[]) =>
    filterRecords(records, getAllowedViewFields());

  const canPerform = (action: 'view' | 'edit' | 'delete' | 'create') =>
    canPerformAction( action, baseContext, modelConfig);

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