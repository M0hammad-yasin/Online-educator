import { ComponentType, ReactNode } from 'react';
import { Role as RoleConst } from '../constants/role';

export type Role = (typeof RoleConst)[keyof typeof RoleConst];
export type UserRole = Role;
export type AccessAction = 'view' | 'edit' | 'delete' | 'create';
export type ModelName = 'student' | 'teacher'|'class';

export interface PermissionContext {
  role: UserRole;
  userId: string;
  permissions?: Partial<Record<AccessAction, ModelName>>[];
  record?: any;
}

export interface GridSpan {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

export interface FieldPermissions {
  view: Record<UserRole, string[]>;
  edit: Record<UserRole, string[]>;
  delete?: Record<UserRole, boolean>;
  create?: Record<UserRole, string[]>;
}

export type ContextOverride = (
  context: PermissionContext,
  basePermissions: string[]
) => string[];

export interface ModelConfig {
  name: ModelName;
  label: string;
  fieldPermissions: FieldPermissions;
  contextOverrides?: Record<UserRole, ContextOverride>;
  alwaysInclude?: string[];
  sensitiveFields?: string[];
}

export interface WidgetConfig<TProps = any> {
  id: string;
  label?: string;
  component: ComponentType<TProps>;
  roles: UserRole[];
  permissions?: Partial<Record<AccessAction, ModelName>>[];
  canView?: (context: PermissionContext) => boolean;
  grid?: GridSpan;
  order?: number;
  wrapInCard?: boolean;
  cardProps?: any;
  loading?: 'eager' | 'lazy';
  errorFallback?: ComponentType<any>;
  props?: TProps;
  model?: ModelName;
  modelActions?: AccessAction[];
  applyFieldFiltering?: boolean;
  fieldOverrides?: {
    view?: string[];
    edit?: string[];
    additionalFields?: string[];
    excludeFields?: string[];
  };
  getPermissionContext?: (props: TProps) => Partial<PermissionContext>;
}

export interface SectionConfig {
  id: string;
  label?: string;
  description?: string;
  roles?: UserRole[];
  widgets: WidgetConfig[];
  canView?: (context: PermissionContext) => boolean;
  order?: number;
  containerProps?: any;
}

export interface PageConfig {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  sections: SectionConfig[];
  roles: UserRole[];
  header?: {
    show: boolean;
    customComponent?: ComponentType;
  };
  meta?: {
    requiresOnboarding?: boolean;
    analytics?: string;
    helpUrl?: string;
  };
}


