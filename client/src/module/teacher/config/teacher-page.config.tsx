import { TeamOutlined } from '@ant-design/icons';
import { Role } from '../../../constants/role';
import { PageConfig } from '../../../config/rbac-types';

import {
  SummaryCards,
  PerformanceCharts,
  FiltersBar,
  TeacherList,
} from '../components';

export const teacherPageConfig: PageConfig = {
  id: 'teachers',
  title: 'Teachers Management',
  description: 'Manage teacher profiles, performance, and access controls',
  icon: <TeamOutlined />,
  roles: [Role.ADMIN, Role.MODERATOR],
  header: { show: true },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      order: 1,
      widgets: [
        {
          id: 'summary-cards',
          label: 'Summary',
          component: SummaryCards,
          roles: [Role.ADMIN, Role.MODERATOR],
          model: 'teacher',
          modelActions: ['view'],
          applyFieldFiltering: false,
          grid: { xs: 24 },
          order: 1,
          wrapInCard: false,
        },
      ],
    },
    {
      id: 'insights',
      label: 'Performance Insights',
      order: 2,
      widgets: [
        {
          id: 'performance-charts',
          component: PerformanceCharts,
          roles: [Role.ADMIN, Role.MODERATOR],
          model: 'teacher',
          modelActions: ['view'],
          applyFieldFiltering: false,
          grid: { xs: 24 },
          order: 1,
          wrapInCard: false,
        },
      ],
    },
    {
      id: 'management',
      label: 'Teacher Management',
      order: 3,
      widgets: [
        {
          id: 'teacher-list',
          component: TeacherList,
          roles: [Role.ADMIN, Role.MODERATOR],
          model: 'teacher',
          modelActions: ['view', 'edit'],
          applyFieldFiltering: false,
          grid: { xs: 24 },
          order: 1,
          wrapInCard: true,
          cardProps: { variant: 'borderless', title: <FiltersBar /> },
        },
      ],
    },
  ],
};


