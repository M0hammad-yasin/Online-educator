import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Admin Placeholder Components
// In a real app, you would import actual admin components
const TeachersManagement = () => <div>Manage Teachers</div>;
const StudentsManagement = () => <div>Manage Students</div>;
const ClassesManagement = () => <div>Manage Classes</div>;
const SubjectsManagement = () => <div>Manage Subjects</div>;
const AssignmentsManagement = () => <div>Manage Assignments</div>;
const Calendar = () => <div>Calendar</div>;
const Settings = () => <div>Settings</div>;
const Profile = () => <div>My Profile</div>;

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="teachers" element={<TeachersManagement />} />
      <Route path="students" element={<StudentsManagement />} />
      <Route path="classes" element={<ClassesManagement />} />
      <Route path="subjects" element={<SubjectsManagement />} />
      <Route path="assignments" element={<AssignmentsManagement />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="settings" element={<Settings />} />
      <Route path="profile" element={<Profile />} />
      <Route index element={<div>Admin Dashboard</div>} />
      <Route path="*" element={<div>Admin Page Not Found</div>} />
    </Routes>
  );
};

export default AdminRoutes;
