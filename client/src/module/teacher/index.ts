// Teacher management feature module for online education platform
//components
export * from './components';
// Types
export * from './types';

// Services
export { default as teacherService } from './services/teacher.service';
export {teacherStatisticsService  } from './services/teacherStatistics.service';

// Hooks
export * from './hooks/useTeachers';
export * from './hooks/useTeacherStatistics';

// Store
export * from './store/useTeacherStore';

//config
export * from './config/teacher.config'

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
} from './store/useTeacherStore';