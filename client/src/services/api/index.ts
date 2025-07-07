export * from './types';
export * from './client';
export * from './base.service';

// Feature services
export * from '../../features/authentication/services/auth.service';
export * from './features/user.service';
export * from './features/class.service';
export * from './features/teacher.service';
export * from './features/student.service';

// Service instances
export { authService } from '../../features/authentication/services/auth.service';
export { userService } from './features/user.service';
export { classService } from './features/class.service';
export { teacherService } from './features/teacher.service';
export { studentService } from './features/student.service'; 