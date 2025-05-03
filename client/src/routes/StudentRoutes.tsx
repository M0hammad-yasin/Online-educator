// client/src/routes/StudentRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Student Placeholder Components
// In a real app, you would import actual student components
const EnrolledCourses = () => <div>Enrolled Courses</div>;
const CourseContent = () => <div>Course Content</div>;
const MyAssignments = () => <div>My Assignments</div>;
const MyGrades = () => <div>My Grades</div>;
const StudentProfile = () => <div>Student Profile</div>;

const StudentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="courses" element={<EnrolledCourses />} />
      <Route path="courses/:courseId" element={<CourseContent />} />
      <Route path="assignments" element={<MyAssignments />} />
      <Route path="grades" element={<MyGrades />} />
      <Route path="profile" element={<StudentProfile />} />
      <Route index element={<div>Student Dashboard</div>} />
      <Route path="*" element={<div>Student Page Not Found</div>} />
    </Routes>
  );
};

export default StudentRoutes;

