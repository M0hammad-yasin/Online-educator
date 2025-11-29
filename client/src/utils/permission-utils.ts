import {
  ModelConfig,
  PermissionContext,
  AccessAction,
} from '../config/rbac-types';

export function canViewField(
  field: string,
  context: PermissionContext,
  modelConfig: ModelConfig
): boolean {
  if (context.role == 'TEACHER') return !!context.permissions?.view;
  const basePermissions = modelConfig.fieldPermissions.view[context.role] || [];
  if (basePermissions.includes('*')) return true;
  if (!basePermissions.includes(field)) return false;
  if (modelConfig.contextOverrides?.[context.role] && context.record) {
    const override = modelConfig.contextOverrides[context.role];
    const adjustedPermissions = override(context, basePermissions);
    return adjustedPermissions.includes(field);
  }
  return true;
}

export function canEditField(
  field: string,
  context: PermissionContext,
  modelConfig: ModelConfig
): boolean {
  if (context.role == 'TEACHER') return !!context.permissions?.edit;
  const basePermissions = modelConfig.fieldPermissions.edit[context.role] || [];
  if (basePermissions.includes('*')) return true;
  if (!basePermissions.includes(field)) return false;
  if (modelConfig.contextOverrides?.[context.role] && context.record) {
    const override = modelConfig.contextOverrides[context.role];
    const adjustedPermissions = override(context, basePermissions);
    return adjustedPermissions.includes(field);
  }
  return true;
}

export function getAllowedViewFields(
  context: PermissionContext,
  modelConfig: ModelConfig,
): string[] {
  let fields = modelConfig.fieldPermissions.view[context.role] || [];
  if (modelConfig.contextOverrides?.[context.role] && context.record) {
    fields = modelConfig.contextOverrides[context.role](context, fields);
  }
  if (modelConfig.alwaysInclude) {
    fields = [...new Set([...fields, ...modelConfig.alwaysInclude])];
  }
  return fields;
}

export function getAllowedEditFields(
  context: PermissionContext,
  modelConfig: ModelConfig,
): string[] {
  let fields = modelConfig.fieldPermissions.edit[context.role] || [];
  if (modelConfig.contextOverrides?.[context.role] && context.record) {
    fields = modelConfig.contextOverrides[context.role](context, fields);
  }
  return fields;
}

export function filterRecordFields<T extends Record<string, any>>(
  record: T,
  allowedFields: string[]
): Partial<T> {
  if (allowedFields.includes('*')) return record;
  const filtered: any = {};
  allowedFields.forEach(field => {
    if (field in record) {
      filtered[field] = record[field];
    }
  });
  return filtered;
}

export function filterRecords<T extends Record<string, any>>(
  records: T[],
  allowedFields: string[]
): Partial<T>[] {
  return records.map(record => filterRecordFields(record, allowedFields));
}

export function canPerformAction(
  action: AccessAction,
  context: PermissionContext,
  modelConfig: ModelConfig
): boolean {
  switch (action) {
    case 'view':
      const viewFields = getAllowedViewFields(context, modelConfig);
      if (context.permissions?.view) return true;
      return viewFields.length > 0 || viewFields.includes('*');
    case 'edit':
      const editFields = getAllowedEditFields(context, modelConfig);
      if (context.permissions?.edit) return true;
      return editFields.length > 0 || editFields.includes('*');
    case 'delete':
      if (context.permissions?.delete) return true;
      return modelConfig.fieldPermissions.delete?.[context.role] ?? false;
    case 'create':
      const createFields = modelConfig.fieldPermissions.create?.[context.role] || [];
      if (context.permissions?.create) return true;
      return createFields.length > 0 || createFields.includes('*');
    default:
      return false;
  }
}


