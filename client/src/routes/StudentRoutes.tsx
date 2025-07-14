// client/src/routes/StudentRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from '../pages/Profile';

// Student Placeholder Components
// In a real app, you would import actual student components
const MyClasses = () => <div>My Classes</div>;
const MyAssignments = () => <div>My Assignments</div>;
const Calendar = () => <div>Calendar</div>;
const StudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="classes" element={<MyClasses />} />
      <Route path="assignments" element={<MyAssignments />} />
      <Route path="calendar" element={<Calendar />} />
      <Route path="profile" element={<Profile />} />
      <Route index element={<div>Student Dashboard</div>} />
      <Route path="*" element={<div>Student Page Not Found</div>} />
    </Routes>
  );
};

export default StudentRoutes;

