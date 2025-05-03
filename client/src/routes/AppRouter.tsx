import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout} from 'antd';
import { Login, ForgotPassword, Logout } from '../pages';
import AdminRoutes from './AdminRoutes';
import TeacherRoutes from './TeacherRoutes';
import StudentRoutes from './StudentRoutes';
import { AppHeader, MainContent, Sidebar } from '../components/layout';
import Dashboard from '../components/dashboard/Dashboard';
import useAuthStore, { UserRole } from '../store/authStore';
import { Role } from '../constants/role';

// Auth guard for protected routes
const ProtectedRoute = ({ 
  children, 
  role ,
  redirectUrl,
}: { 
  children: React.ReactNode, 
  role: UserRole | UserRole[] |null,
  redirectUrl?: string,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  
  // Check if user has required role
  if (role && user?.role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.role)) {
      // User doesn't have the required role, redirect to dashboard
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
  const { isAuthenticated,checkAuthStatus } = useAuthStore();
  
  // Check authentication status when app loads
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Default route - redirect to dashboard if authenticated, login if not */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
          } 
        />
        
        {/* Protected Routes with Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role={null}>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Role-based Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute role={Role.ADMIN}>
              <AppLayout>
                <AdminRoutes />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/teacher/*" 
          element={
            <ProtectedRoute role={Role.TEACHER}>
              <AppLayout>
                <TeacherRoutes />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/student/*" 
          element={
            <ProtectedRoute role={Role.STUDENT}>
              <AppLayout>
                <StudentRoutes />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Catch All */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;