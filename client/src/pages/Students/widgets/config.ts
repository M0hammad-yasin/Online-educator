import { Role } from '../../../constants/role';

export type WidgetKey = 'SummaryCards' | 'FiltersBar' | 'StudentList';

export interface WidgetConfigItem {
  key: WidgetKey;
  roles: Array<(typeof Role)[keyof typeof Role]>;
}

export interface PageWidgetsConfig {
  top: WidgetConfigItem[];
  main: WidgetConfigItem[];
}

export const WidgetsConfig: PageWidgetsConfig = {
  top: [
    { key: 'SummaryCards', roles: [Role.ADMIN, Role.MODERATOR] },
    { key: 'FiltersBar', roles: [Role.ADMIN, Role.MODERATOR] },
  ],
  main: [
    { key: 'StudentList', roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER] },
  ],
};

export function getVisibleWidgets(role: (typeof Role)[keyof typeof Role]) {
  return {
    top: WidgetsConfig.top.filter((w) => w.roles.includes(role)),
    main: WidgetsConfig.main.filter((w) => w.roles.includes(role)),
  };
}


