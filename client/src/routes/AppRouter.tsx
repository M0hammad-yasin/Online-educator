import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout} from 'antd';
import { Login, ForgotPassword, Logout } from '../module/authentication/components';
import Register from '../module/authentication/components/Register';
import AdminRoutes from './AdminRoutes';
import TeacherRoutes from './TeacherRoutes';
import StudentRoutes from './StudentRoutes';
import { AppHeader, MainContent, Sidebar } from '../components/layout';
import Dashboard from '../components/dashboard/Dashboard';
import useAuthStore, { UserRole } from '../module/authentication/store/authStore';
import { Role } from '../constants/role';

// Auth guard for protected routes
const AuthGuard = ({ children, role, redirectUrl }: {
  children: React.ReactNode,
  role?: UserRole | UserRole[] | null,
  redirectUrl?: string,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.role)) {
      return <Navigate to={redirectUrl || "/dashboard"} />;
    }
  }

  return <>{children}</>;
};

// App layout component for authenticated routes
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <MainContent>
          {children}
        </MainContent>
      </Layout>
    </Layout>
  );
};

const AppRouter: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />

        {/* Default route - redirect to dashboard if authenticated, login if not */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Navigate to="/dashboard" replace />
            </AuthGuard>
          }
        />

        {/* Protected Routes with Layout */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </AuthGuard>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/teachers"
          element={
            <AuthGuard role={Role.ADMIN}>
              <AppLayout>
                <div>Manage Teachers</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/students"
          element={
            <AuthGuard role={[Role.ADMIN, Role.TEACHER]}>
              <AppLayout>
                <div>Manage Students</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/classes"
          element={
            <AuthGuard role={[Role.ADMIN, Role.TEACHER, Role.STUDENT]}>
              <AppLayout>
                <div>Manage Classes</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/subjects"
          element={
            <AuthGuard role={Role.ADMIN}>
              <AppLayout>
                <div>Manage Subjects</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/assignments"
          element={
            <AuthGuard role={[Role.ADMIN, Role.TEACHER, Role.STUDENT]}>
              <AppLayout>
                <div>Manage Assignments</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/calendar"
          element={
            <AuthGuard role={[Role.ADMIN, Role.TEACHER, Role.STUDENT]}>
              <AppLayout>
                <div>Calendar</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard role={[Role.ADMIN, Role.TEACHER, Role.STUDENT]}>
              <AppLayout>
                <div>Settings</div>
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard role={[Role.ADMIN, Role.TEACHER, Role.STUDENT]}>
              <AppLayout>
                <div>My Profile</div>
              </AppLayout>
            </AuthGuard>
          }
        />

        {/* Legacy Role-based Routes (keeping for backward compatibility) */}
        <Route
          path="/admin/*"
          element={
            <AuthGuard role={Role.ADMIN}>
              <AppLayout>
                <AdminRoutes />
              </AppLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/teacher/*"
          element={
            <AuthGuard role={Role.TEACHER}>
              <AppLayout>
                <TeacherRoutes />
              </AppLayout>
            </AuthGuard>
          }
        />

        <Route
          path="/student/*"
          element={
            <AuthGuard role={Role.STUDENT}>
              <AppLayout>
                <StudentRoutes />
              </AppLayout>
            </AuthGuard>
          }
        />

        {/* 404 Catch All */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;