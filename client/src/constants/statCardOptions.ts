// Define StatCard options constants

export const CLASS_TITLE_OPTIONS = [
  { value: "allClasses", label: "Total Classes" },
  { value: "activeClass", label: "Active Class" },
  { value: "upcomingClass", label: "Upcoming Class" },
  { value: "classCompleted", label: "Class Completed" },
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

export const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "thisMonth", label: "This Month" },
];

// Default values for each card type
export const DEFAULT_TITLE_VALUES = {
  class: "allClasses",
  student: "allStudents",
  teacher: "allTeachers",
  course: "allCourses",
};
