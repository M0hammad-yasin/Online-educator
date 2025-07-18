// Types
export * from './types/student.types';

// Services
export { default as studentService } from './services/student.service';
// Hooks
export * from './hooks/useStudents';

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
  useStudentStore,
  useStudentSelection,
  useStudentModals,
  useStudentFilters,
  useStudentView,
  useStudentUI,
} from './store/useStudentStore';