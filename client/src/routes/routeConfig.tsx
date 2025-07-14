import { UserRole } from '../module/authentication/store/authStore';
import { Role } from '../constants/role';

// Page Components (these would be imported from their actual locations)
import Dashboard from '../components/dashboard/Dashboard';

// Placeholder components (replace with actual components)
const TeachersManagement = () => <div>Manage Teachers</div>;
const StudentsManagement = () => <div>Manage Students</div>;
const ClassesManagement = () => <div>Manage Classes</div>;
const SubjectsManagement = () => <div>Manage Subjects</div>;
const AssignmentsManagement = () => <div>Manage Assignments</div>;
const Calendar = () => <div>Calendar</div>;
const Settings = () => <div>Settings</div>;
const Profile = () => <div>My Profile</div>;

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  allowedRoles?: UserRole | UserRole[];
  title?: string;
}

export const protectedRoutes: RouteConfig[] = [
  // Common routes (all authenticated users)
  {
    path: '/dashboard',
    component: Dashboard,
    title: 'Dashboard'
  },
  {
    path: '/calendar',
    component: Calendar,
    title: 'Calendar'
  },
  {
    path: '/settings',
    component: Settings,
    title: 'Settings'
  },
  {
    path: '/profile',
    component: Profile,
    title: 'Profile'
  },
  
  // Admin only routes
  {
    path: '/teachers',
    component: TeachersManagement,
    allowedRoles: Role.ADMIN,
    title: 'Manage Teachers'
  },
  {
    path: '/subjects',
    component: SubjectsManagement,
    allowedRoles: Role.ADMIN,
    title: 'Manage Subjects'
  },
  
  // Admin & Teacher routes
  {
    path: '/students',
    component: StudentsManagement,
    allowedRoles: [Role.ADMIN, Role.TEACHER],
    title: 'Manage Students'
  },
  
  // All roles (Admin, Teacher, Student)
  {
    path: '/classes',
    component: ClassesManagement,
    allowedRoles: [Role.ADMIN, Role.TEACHER, Role.STUDENT],
    title: 'Classes'
  },
  {
    path: '/assignments',
    component: AssignmentsManagement,
    allowedRoles: [Role.ADMIN, Role.TEACHER, Role.STUDENT],
    title: 'Assignments'
  },
];

export const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/logout'
];