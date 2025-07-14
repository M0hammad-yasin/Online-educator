
// client/src/routes/TeacherRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '../pages/Profile';

// Teacher Placeholder Components
// In a real app, you would import actual teacher components
const MyClasses = () => <div>My Classes</div>;
const MyAssignments = () => <div>My Assignments</div>;
const Calendar = () => <div>Calendar</div>;
const MyStudents = () => <div>My Students</div>;
const Settings = () => <div>Settings</div>;
const TeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="classes" element={<MyClasses />} />
      <Route path="assignments" element={<MyAssignments />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="students" element={<MyStudents />} />
      <Route path="settings" element={<Settings />} />
      <Route path="profile" element={<Profile />} />
      <Route index element={<div>Teacher Dashboard</div>} />
      <Route path="*" element={<div>Teacher Page Not Found</div>} />
    </Routes>
  );
};

export default TeacherRoutes;

