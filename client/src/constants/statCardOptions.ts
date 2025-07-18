// Define StatCard options constants

import { SelectClassOption } from "../module/classes/components/ClassStatsCard";

export const CLASS_TITLE_OPTIONS = [
  { value: "allClasses", label: "Total Classes" }as unknown as SelectClassOption,
  { value: "activeClass", label: "Active Class" }as unknown as SelectClassOption,
  { value: "upcomingClass", label: "Upcoming Class" }as unknown as SelectClassOption,
  { value: "classCompleted", label: "Class Completed" }as unknown as SelectClassOption,
];

export const STUDENT_TITLE_OPTIONS = [
  { value: "allStudents", label: "Total Students" },
  { value: "activeStudents", label: "Active Students" },
  { value: "terminatedStudents", label: "Terminated Students" },
];

export const TEACHER_TITLE_OPTIONS = [
  { value: "allTeachers", label: "Total Teachers" },
  { value: "activeTeachers", label: "Active Teachers" },
  { value: "terminatedTeachers", label: "Terminated Teachers" },
  { value: "teachersOnLeave", label: "Teachers On Leave" },
];

export const COURSE_TITLE_OPTIONS = [
  { value: "allCourses", label: "Total Courses" },
  { value: "activeCourses", label: "Active Courses" },
  { value: "completedCourses", label: "Completed Courses" },
];
