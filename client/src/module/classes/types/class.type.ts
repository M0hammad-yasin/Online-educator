// client/src/module/classes/types/index.ts

export type ClassStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'|'all-classes';

export interface Class {
  id: string;
  subject: string;
  scheduledAt: string;
  startTime?: string;
  teacherId: string;
  studentId: string;
  classLink?: string;
  duration: string;
  classStatus: ClassStatus;
  teacher?: {
    id: string;
    name: string;
    email: string;
    qualification?: string;
    classRate?: number;
  };
  student?: {
    id: string;
    name: string;
    email: string;
    grade: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassRequest {
  subject: string;
  scheduledAt: string;
  startTime?: string;
  teacherId: string;
  studentId: string;
  classLink?: string;
  duration: string;
  classStatus: ClassStatus;
}

export interface UpdateClassRequest {
  subject?: string;
  scheduledAt?: string;
  startTime?: string;
  teacherId?: string;
  studentId?: string;
  classLink?: string;
  duration?: string;
  classStatus?: ClassStatus;
}
// types/OrderByTypes.ts
export type ClassOrderBy = Array<
  Partial<
    Record<
      | "status"
      | "subject"
      | "startTime"
      | "duration"
      | "grade"
      |"teacherName"
      |"studentName",
      "asc" | "desc"
    >
  >
>;


export interface ClassFilters {
  startDate?: string;
  endDate?: string;
  orderBy?: ClassOrderBy;
  studentId?: string;
  teacherId?: string;
  status?: ClassStatus | 'all-classes';
  searchData?: string;
  grade?: number;
  page?: number;
  groupBy?:'teacher' | 'student' | 'status' | 'subject' | 'startTime' | 'day' | 'hour' | 'month' | 'grade' ;
  limit?: number;
}

export interface ClassCountByGroup {
  groupBy: 'teacher' | 'student' | 'status' | 'subject' | 'startTime' | 'day' | 'hour' | 'month' | 'grade';
}

export interface ClassSelection {
  id: string;
  subject: string;
  scheduledAt: string;
  teacher: {
    id: string;
    name: string;
  };
  student: {
    id: string;
    name: string;
  };
}

export interface ClassCount {
  classCount: number;
}

export interface GroupedClass {
  [key: string]: Class[];
}

export interface CalendarClass {
  id: string;
  title: string;
  start: string;
  end: string;
  status: ClassStatus;
  teacher: string;
  student: string;
  subject: string;
}