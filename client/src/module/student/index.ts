// Types
export * from './types/student.types';

// Services
export { default as studentService } from './services/student.service';
// Hooks
export * from './hooks/useStudents';
//components
export * from './components';
// Store
export * from './store/useStudentStore';

// Re-export commonly used items for convenience
export {
  useStudents,
  useStudent,
  useStudentsForSelection,
  useStudentCount,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useStudentOperations,
} from './hooks/useStudents';
export {
  hasAccess,widgetConfig
} from "./config/student.config";
export {
  useStudentStore,
  useStudentSelection,
  useStudentModals,
  useStudentFilters,
  useStudentView,
  useStudentUI,
} from './store/useStudentStore';