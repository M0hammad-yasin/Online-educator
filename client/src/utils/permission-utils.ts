import {
  ModelConfig,
  PermissionContext,
  ModelName,
  AccessAction,
  WidgetConfig,
  SectionConfig,
  PageConfig,
} from '../config/rbac-types';

export function canViewField(
  field: string,
  context: PermissionContext,
  modelConfig: ModelConfig
): boolean {
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
  widgetOverrides?: WidgetConfig['fieldOverrides']
): string[] {
  let fields = modelConfig.fieldPermissions.view[context.role] || [];
  if (modelConfig.contextOverrides?.[context.role] && context.record) {
    fields = modelConfig.contextOverrides[context.role](context, fields);
  }
  if (widgetOverrides) {
    if (widgetOverrides.view) {
      fields = widgetOverrides.view;
    } else {
      if (widgetOverrides.additionalFields) {
        fields = [...fields, ...widgetOverrides.additionalFields];
      }
      if (widgetOverrides.excludeFields) {
        fields = fields.filter(f => !widgetOverrides.excludeFields!.includes(f));
      }
    }
  }
  if (modelConfig.alwaysInclude) {
    fields = [...new Set([...fields, ...modelConfig.alwaysInclude])];
  }
  return fields;
}

export function getAllowedEditFields(
  context: PermissionContext,
  modelConfig: ModelConfig,
  widgetOverrides?: WidgetConfig['fieldOverrides']
): string[] {
  let fields = modelConfig.fieldPermissions.edit[context.role] || [];
  if (modelConfig.contextOverrides?.[context.role] && context.record) {
    fields = modelConfig.contextOverrides[context.role](context, fields);
  }
  if (widgetOverrides) {
    if (widgetOverrides.edit) {
      fields = widgetOverrides.edit;
    } else {
      if (widgetOverrides.additionalFields) {
        fields = [...fields, ...widgetOverrides.additionalFields];
      }
      if (widgetOverrides.excludeFields) {
        fields = fields.filter(f => !widgetOverrides.excludeFields!.includes(f));
      }
    }
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
      return getAllowedViewFields(context, modelConfig).length > 0;
    case 'edit':
      return getAllowedEditFields(context, modelConfig).length > 0;
    case 'delete':
      return modelConfig.fieldPermissions.delete?.[context.role] ?? false;
    case 'create':
      const createFields = modelConfig.fieldPermissions.create?.[context.role] || [];
      return createFields.length > 0 || createFields.includes('*');
    default:
      return false;
  }
}

export function canViewWidget(
  widget: WidgetConfig,
  context: PermissionContext,
  modelConfigs: Record<ModelName, ModelConfig>
): boolean {
  if (!widget.roles.includes(context.role)) return false;
  if (widget.canView && !widget.canView(context)) return false;
  if (widget.model && widget.modelActions) {
    const modelConfig = modelConfigs[widget.model];
    if (!modelConfig) return true;
    const hasAnyAction = widget.modelActions.some(action =>
      canPerformAction( action, context, modelConfig)
    );
    if (!hasAnyAction) return false;
  }
  return true;
}

export function getVisibleWidgets(
  widgets: WidgetConfig[],
  context: PermissionContext,
  modelConfigs: Record<ModelName, ModelConfig>
): WidgetConfig[] {
  return widgets
    .filter(widget => canViewWidget(widget, context, modelConfigs))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function canViewSection(
  section: SectionConfig,
  context: PermissionContext,
  modelConfigs: Record<ModelName, ModelConfig>
): boolean {
  if (section.roles && !section.roles.includes(context.role)) return false;
  if (section.canView && !section.canView(context)) return false;
  const visible = getVisibleWidgets(section.widgets, context, modelConfigs);
  return visible.length > 0;
}

export function getVisibleSections(
  sections: SectionConfig[],
  context: PermissionContext,
  modelConfigs: Record<ModelName, ModelConfig>
): SectionConfig[] {
  return sections
    .filter(section => canViewSection(section, context, modelConfigs))
    .map(section => ({
      ...section,
      widgets: getVisibleWidgets(section.widgets, context, modelConfigs),
    }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

export function canViewPage(page: PageConfig, context: PermissionContext): boolean {
  return page.roles.includes(context.role);
}

export function validatePageConfig(config: PageConfig): string[] {
  const errors: string[] = [];
  config.sections.forEach((section) => {
    section.widgets.forEach((widget) => {
      if (!widget.component) {
        errors.push(`Widget "${widget.id}" in section "${section.id}" is missing component`);
      }
      if (!widget.roles || widget.roles.length === 0) {
        errors.push(`Widget "${widget.id}" has no roles defined`);
      }
    });
  });
  return errors;
}


