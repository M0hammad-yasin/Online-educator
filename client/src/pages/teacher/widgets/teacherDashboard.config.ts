// teacherDashboard.config.ts
// Config-driven, role-aware widget layout system for Teachers Management Dashboard

import { Role } from '../../../constants/role';

export type WidgetKey = 
  | 'SummaryCards' 
  | 'PerformanceCharts'
  | 'FiltersBar' 
  | 'TeacherList'
  | 'AccessControlPanel';

export interface WidgetConfigItem {
  key: WidgetKey;
  roles: Array<(typeof Role)[keyof typeof Role]>;
  gridSpan?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  order?: number; // For controlling widget order in the layout
}

export interface DashboardSection {
  id: string;
  label: string;
  widgets: WidgetConfigItem[];
}

// Define dashboard sections with role-based widget visibility
export const DashboardConfig: DashboardSection[] = [
  {
    id: 'metrics',
    label: 'Key Metrics',
    widgets: [
      {
        key: 'SummaryCards',
        roles: [Role.ADMIN, Role.MODERATOR],
        gridSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
        order: 1,
      },
    ],
  },
  {
    id: 'insights',
    label: 'Performance Insights',
    widgets: [
      {
        key: 'PerformanceCharts',
        roles: [Role.ADMIN, Role.MODERATOR],
        gridSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
        order: 2,
      },
    ],
  },
  {
    id: 'management',
    label: 'Teacher Management',
    widgets: [
      // {
      //   key: 'FiltersBar',
      //   roles: [Role.ADMIN, Role.MODERATOR],
      //   gridSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
      //   order: 3,
      // },
      {
        key: 'TeacherList',
        roles: [Role.ADMIN, Role.MODERATOR],
        gridSpan: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
        order: 4,
      },
    ],
  },
];

/**
 * Get visible widgets for a specific role
 * Filters out widgets that the user doesn't have permission to see
 */
export function getVisibleWidgets(role: (typeof Role)[keyof typeof Role]): DashboardSection[] {
  return DashboardConfig.map((section) => ({
    ...section,
    widgets: section.widgets
      .filter((widget) => widget.roles.includes(role))
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  })).filter((section) => section.widgets.length > 0);
}

/**
 * Check if a user has access to a specific widget
 */
export function hasWidgetAccess(
  widgetKey: WidgetKey,
  role: (typeof Role)[keyof typeof Role]
): boolean {
  for (const section of DashboardConfig) {
    const widget = section.widgets.find((w) => w.key === widgetKey);
    if (widget && widget.roles.includes(role)) {
      return true;
    }
  }
  return false;
}

/**
 * Get grid span configuration for a widget
 */
export function getWidgetGridSpan(widgetKey: WidgetKey) {
  for (const section of DashboardConfig) {
    const widget = section.widgets.find((w) => w.key === widgetKey);
    if (widget && widget.gridSpan) {
      return widget.gridSpan;
    }
  }
  // Default span
  return { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
}
