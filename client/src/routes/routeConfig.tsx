import { UserRole } from '../module/authentication';
import { Role } from '../constants/role';
import { Navigate } from 'react-router-dom';


// Page Components (these would be imported from their actual locations)
import {DashboardPage, Profile,ClassPage,ClassUpdatePage, StudentsPage, TeacherPage} from '../pages';
import AuthenticatedNotFound from '../components/AuthenticatedNotFound';

// Placeholder components (replace with actual components)
const TeachersManagement =TeacherPage;
const StudentsManagement = StudentsPage;
const SubjectsManagement = () => <div>Manage Subjects</div>;
const AssignmentsManagement = () => <div>Manage Assignments</div>;
const Calendar = () => <div>Calendar</div>;
const Settings = () => <div>Settings</div>;
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
    component: DashboardPage,
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
  {
    path:'*',
    component:AuthenticatedNotFound,
  },
  
  // Admin only routes
  {
    path: '/teachers',
    component: TeachersManagement,
    allowedRoles:[ Role.ADMIN,Role.MODERATOR],
    title: 'Manage Teachers'
  },
  {
    path: '/subjects',
    component: SubjectsManagement,
    allowedRoles: [Role.ADMIN,Role.MODERATOR],
    title: 'Manage Subjects'
  },
  
  // Admin, Moderator & Teacher routes
  {
    path: '/students',
    component: StudentsManagement,
    allowedRoles: [Role.ADMIN, Role.MODERATOR, Role.TEACHER],
    title: 'Manage Students'
  },
  
  // Classes routes for all roles
  {
    path: '/classes/overview',
    component: ClassPage,
    allowedRoles: [Role.ADMIN,Role.MODERATOR, Role.TEACHER, Role.STUDENT],
    title: 'Classes Overview'
  },
  {
    path: '/classes/list',
    component: ClassPage,
    allowedRoles: [Role.ADMIN,Role.MODERATOR, Role.TEACHER, Role.STUDENT],
    title: 'Class List'
  },
  {
    path: '/classes/create',
    component: ClassPage,
    allowedRoles: [Role.ADMIN,Role.MODERATOR, Role.TEACHER],
    title: 'Create Class'
  },
    {
      path: '/classes/update/:id',
      component: ClassUpdatePage,
      allowedRoles: [Role.ADMIN,Role.MODERATOR, Role.TEACHER],
      title: 'Update Class'
    },
  {
    path: '/classes',
    component: () => <Navigate to="/classes/overview" replace />,
    allowedRoles: [Role.ADMIN,Role.MODERATOR, Role.TEACHER, Role.STUDENT],
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