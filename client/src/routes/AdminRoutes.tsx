import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Admin Placeholder Components
// In a real app, you would import actual admin components
const UsersManagement = () => <div>Users Management</div>;
const CoursesManagement = () => <div>Courses Management</div>;
const ReportsManagement = () => <div>Reports Management</div>;
const Settings = () => <div>Settings</div>;

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="users" element={<UsersManagement />} />
      <Route path="courses" element={<CoursesManagement />} />
      <Route path="reports" element={<ReportsManagement />} />
      <Route path="settings" element={<Settings />} />
      <Route index element={<div>Admin Dashboard</div>} />
      <Route path="*" element={<div>Admin Page Not Found</div>} />
    </Routes>
  );
};

export default AdminRoutes;
