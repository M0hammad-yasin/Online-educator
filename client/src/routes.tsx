import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { AppHeader, MainContent, Sidebar } from './components/layout';
import Dashboard from './components/dashboard/Dashboard';
import { Login, ForgotPassword, Logout } from './pages';

// Layout component that includes the sidebar and header
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
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

// Simple authentication check (replace with actual auth logic)
const isAuthenticated = () => {
  // In a real app, check for auth token or user session
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

// Router configuration
const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={
          <ProtectedRoute element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
        } />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;