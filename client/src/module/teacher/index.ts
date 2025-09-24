// Teacher management feature module for online education platform

// Types
export * from './types/teacher.types';

// Services
export { default as teacherService } from './services/teacher.service';

// Hooks
export * from './hooks/useTeachers';

// Store
export * from './store/useTeacherStore';

// Re-export commonly used items for convenience
export {
  useTeachers,
  useTeacher,
  useTeachersForSelection,
  // useTeacherCount,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
  useTeacherOperations,
} from './hooks/useTeachers';

export {
  useTeacherStore,
  useTeacherSelection,
  useTeacherModals,
  useTeacherFilters,
  useTeacherView,
  useTeacherUI,
} from './store/useTeacherStore';