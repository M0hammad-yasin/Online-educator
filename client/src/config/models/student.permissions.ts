import { ModelConfig } from '../../config/rbac-types';
import { Role } from '../../constants/role';

export const studentModelConfig: ModelConfig = {
  name: 'student',
  label: 'Student',
  alwaysInclude: ['id', 'name'],
  sensitiveFields: ['parentEmail'],
  fieldPermissions: {
    view: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: [
        'id', 'name', 'email', 'phone',
        'grade', 'class', 'attendance', 'performance',
        'createdAt', 'status', 'region','class'
      ],
      [Role.TEACHER]: [
        'id', 'name', 'email', 'phone',
        'grade', 'class', 'attendance', 'performance',
          'class'
      ],
      [Role.STUDENT]: [
        'id', 'name', 'email', 'phone',
        'grade', 'class', 'attendance', 'performance',
        'region'
      ],
    } as any,
    edit: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: [
         'grade', 'class', 'status', 'region',
      ],
      [Role.TEACHER]: ['attendance', 'performance'],
      [Role.STUDENT]: [ 'id', 'name', 'email', 'phone',
        'grade', 'class', 'attendance', 'performance',
        'createdAt', 'status', 'region','class'],
    } as any,
    delete: {
      [Role.ADMIN]: true,
      [Role.MODERATOR]: false,
      [Role.TEACHER]: false,
      [Role.STUDENT]: false,
    } as any,
    create: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: ['name', 'email', 'phone', 'dateOfBirth', 'grade', 'class', 'enrollmentDate'],
      [Role.TEACHER]: [],
      [Role.STUDENT]: [],
    } as any,
  },
  contextOverrides: {
    [Role.TEACHER]: (context: any, base: any) => {
      if (context.record?.teacherId === context.userId) {
        return [...base, 'parentEmail', ];
      }
      return base;
    },
    [Role.STUDENT]: (context:any, base:any) => {
      if (context.record?.id !== context.userId) return [];
      return base;
    },
  } as any,
};


