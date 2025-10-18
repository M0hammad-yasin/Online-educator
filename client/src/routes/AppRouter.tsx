import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import { AppHeader, MainContent, Sidebar } from '../components/layout';
import {useAuthStore, Register, UserRole,Login, ForgotPassword } from '../module/authentication';
import { protectedRoutes, RouteConfig } from './routeConfig';
// Components
const NotFound = () => <div>Page Not Found</div>;

// Auth Guard Component
const AuthGuard = ({ allowedRoles }: { allowedRoles?: UserRole | UserRole[] }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

// App Layout Component
const AppLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <Layout>
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <MainContent>
          <Outlet />
        </MainContent>
      </Layout>
    </Layout>
  );
};

// Root redirect
const RootRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isInitialized = useAuthStore((state) => state.isInitialized);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

// Auth initialization wrapper
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
};

// Helper function to group routes by permissions
const groupRoutesByPermissions = (routes: RouteConfig[]) => {
  const groups = new Map<string, RouteConfig[]>();
  
  routes.forEach(route => {
    const key = route.allowedRoles ? 
      Array.isArray(route.allowedRoles) ? 
        route.allowedRoles.sort().join(',') : 
        route.allowedRoles.toString() 
      : 'public';
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(route);
  });
  
  return groups;
};

const AppRouter: React.FC = () => {
  const routeGroups = groupRoutesByPermissions(protectedRoutes);

  return (
    <BrowserRouter>
      <AuthInitializer>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Routes with Layout */}
          <Route element={<AppLayout />}>
            {Array.from(routeGroups.entries()).map(([permissions, routes]) => {
              const allowedRoles = permissions === 'public' ? 
                undefined : 
                permissions.includes(',') ? 
                  permissions.split(',') as UserRole[] : 
                  permissions as UserRole;

              return (
                <Route key={permissions} element={<AuthGuard allowedRoles={allowedRoles} />}>
                  {routes.map(route => (
                    <Route 
                      key={route.path} 
                      path={route.path} 
                      element={<route.component />} 
                    />
                  ))}
                </Route>
              );
            })}
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
};

export default AppRouter;