import { ModelConfig } from '../../config/rbac-types';
import { Role } from '../../constants/role';

export const teacherModelConfig: ModelConfig = {
  name: 'teacher',
  label: 'Teacher',
  alwaysInclude: ['id', 'name'],
  fieldPermissions: {
    view: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: ['id', 'name', 'email', 'phone', 'subjects', 'status', 'classesTaught', 'experience'],
      [Role.TEACHER]: ['id', 'name', 'email', 'phone', 'subjects', 'status', 'classesTaught'],
      [Role.STUDENT]: ['id', 'name', 'subjects'],
    } as any,
    edit: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: ['name', 'email', 'phone', 'status', 'subjects'],
      [Role.TEACHER]: ['email', 'phone'],
      [Role.STUDENT]: [],
    } as any,
    delete: {
      [Role.ADMIN]: true,
      [Role.MODERATOR]: false,
      [Role.TEACHER]: false,
      [Role.STUDENT]: false,
    } as any,
    create: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: ['name', 'email', 'phone', 'subjects', 'status'],
      [Role.TEACHER]: [],
      [Role.STUDENT]: [],
    } as any,
  },
};


