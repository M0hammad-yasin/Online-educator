import { ModelConfig } from '../../config/rbac-types';
import { Role } from '../../constants/role';

export const classModelConfig: ModelConfig = {
  name: 'class' as any,
  label: 'Class',
  alwaysInclude: ['id', 'subject', 'scheduledAt', 'startTime', 'status'],
  fieldPermissions: {
    view: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: [
        'id', 'subject', 'scheduledAt', 'startTime', 'endTime',
        'teacher', 'teacherId', 'student', 'studentId', 'duration', 
        'status', 'classLink', 'createdAt', 'updatedAt', 'title'
      ],
      [Role.TEACHER]: [
        'id', 'subject', 'scheduledAt', 'startTime', 'endTime',
        'student', 'studentId', 'duration', 'status', 'classLink', 
        'title', 'createdAt', 'updatedAt'
      ],
      [Role.STUDENT]: [
        'id', 'subject', 'scheduledAt', 'startTime', 'endTime',
        'teacher', 'teacherId', 'duration', 'status', 'classLink', 'title'
      ],
    } as any,
    edit: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: [
        'subject', 'scheduledAt', 'startTime', 'endTime', 
        'teacherId', 'studentId', 'duration', 'status', 'classLink', 'title'
      ],
      [Role.TEACHER]: [
        'subject', 'scheduledAt', 'startTime', 'endTime', 
        'duration', 'status', 'classLink', 'title'
      ],
      [Role.STUDENT]: [], // Students can't edit classes
    } as any,
    delete: {
      [Role.ADMIN]: true,
      [Role.MODERATOR]: true,
      [Role.TEACHER]: false,
      [Role.STUDENT]: false,
    } as any,
    create: {
      [Role.ADMIN]: ['*' as any],
      [Role.MODERATOR]: [
        'subject', 'scheduledAt', 'startTime', 'endTime', 
        'teacherId', 'studentId', 'duration', 'status', 'classLink', 'title'
      ],
      [Role.TEACHER]: [
        'subject', 'scheduledAt', 'startTime', 'endTime', 
        'studentId', 'duration', 'classLink', 'title'
      ],
      [Role.STUDENT]: [],
    } as any,
  },
  contextOverrides: {
    [Role.TEACHER]: (context: any, base: any) => {
      // Teachers can view and edit only their own classes
      if (context.record?.teacherId === context.userId) {
        return [...base, 'teacherId', 'studentId', 'updatedAt', 'createdAt'];
      }
      return [];
    },
    [Role.STUDENT]: (context: any, base: any) => {
      // Students can view only their own enrolled classes
      if (context.record?.studentId === context.userId) {
        return [...base, 'teacher', 'student'];
      }
      return [];
    },
  } as any,
};