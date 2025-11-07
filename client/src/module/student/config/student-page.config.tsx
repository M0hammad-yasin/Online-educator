import { TeamOutlined } from '@ant-design/icons';
import { Role } from '../../../constants/role';
import { PageConfig } from '../../../config/rbac-types';

import {
  StudentPageHeader,
  StudentStatsCards,
  StudentCharts,
  StudentFilterBar,
  StudentTable,
  AddStudentModal,
} from '../components';

export const studentPageConfig: PageConfig = {
  id: 'students',
  title: 'Students Management',
  description: 'Manage student profiles, performance, and attendance',
  icon: <TeamOutlined />,
  roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER],
  header: { show: true, customComponent: StudentPageHeader },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      description: 'Key student metrics and statistics',
      containerProps:'',
      order: 1,
      widgets: [
        {
          id: 'student-stats',
          label: 'Student Statistics',
          component: StudentStatsCards,
          roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER],
          model: 'student',
          modelActions: ['view'],
          applyFieldFiltering: true,
          fieldOverrides: {
            view: ['id', 'status', 'grade', 'attendance', 'performance'],
          },
          grid: { xs: 24 },
          order: 1,
          wrapInCard: false,
          loading: 'eager',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Student performance and attendance insights',
      order: 2,
      roles: [Role.ADMIN, Role.MODERATOR],
      widgets: [
        {
          id: 'student-charts',
          label: 'Performance Charts',
          component: StudentCharts,
          roles: [Role.ADMIN, Role.MODERATOR],
          model: 'student',
          modelActions: ['view'],
          applyFieldFiltering: true,
          fieldOverrides: {
            view: ['id', 'grade', 'attendance', 'performance', 'region', 'enrollmentDate', 'subjects'],
          },
          grid: { xs: 24 },
          order: 1,
          wrapInCard: false,
          loading: 'lazy',
        },
      ],
    },
    {
      id: 'data-management',
      label: 'Student Records',
      description: 'View and manage student information',
      order: 3,
      widgets: [
        {
          id: 'student-table',
          label: 'Student List',
          component: StudentTable,
          roles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER],
          model: 'student',
          modelActions: ['view', 'edit'],
          applyFieldFiltering: true,
          getPermissionContext: (props: any) => ({ record: props?.selectedStudent || null }),
          grid: { xs: 24 },
          order: 1,
          wrapInCard: true,
          cardProps: { variant: 'borderless', title: <StudentFilterBar />, styles: { body: { padding: 0 } } },
          loading: 'eager',
        },
      ],
    },
    {
      id: 'actions',
      label: 'Actions',
      order: 999,
      widgets: [
        {
          id: 'add-student-modal',
          component: AddStudentModal,
          roles: [Role.ADMIN, Role.MODERATOR],
          model: 'student',
          modelActions: ['create'],
          applyFieldFiltering: true,
          fieldOverrides: { excludeFields: ['id', 'createdAt', 'updatedAt'] },
          permissions: [{create:'student'}],
          wrapInCard: false,
          loading: 'eager',
          order: 1,
        },
      ],
    },
  ],
  meta: { requiresOnboarding: false, analytics: 'students_page', helpUrl: '/docs/students' },
};


