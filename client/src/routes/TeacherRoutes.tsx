
// client/src/routes/TeacherRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Teacher Placeholder Components
// In a real app, you would import actual teacher components
const MyCourses = () => <div>My Courses</div>;
const Students = () => <div>My Students</div>;
const Assignments = () => <div>Assignments</div>;
const Grades = () => <div>Grades</div>;
const TeacherProfile = () => <div>Teacher Profile</div>;

const TeacherRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="courses" element={<MyCourses />} />
      <Route path="students" element={<Students />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="grades" element={<Grades />} />
      <Route path="profile" element={<TeacherProfile />} />
      <Route index element={<div>Teacher Dashboard</div>} />
      <Route path="*" element={<div>Teacher Page Not Found</div>} />
    </Routes>
  );
};

export default TeacherRoutes;

