import { useMemo } from 'react';
import { usePermissions } from './usePermissions';
import { ModelName } from '../config/rbac-types';

export function useFieldAccess(model: ModelName, record?: any) {
  const { canView, canEdit, getAllowedViewFields, getAllowedEditFields } = usePermissions(model);

  const viewableFields = useMemo(() => getAllowedViewFields(record), [getAllowedViewFields, record]);
  const editableFields = useMemo(() => getAllowedEditFields(record), [getAllowedEditFields, record]);

  return {
    canView: (field: string) => canView(field, record),
    canEdit: (field: string) => canEdit(field, record),
    viewableFields,
    editableFields,
    hasAnyViewAccess: viewableFields.length > 0,
    hasAnyEditAccess: editableFields.length > 0,
  };
}


