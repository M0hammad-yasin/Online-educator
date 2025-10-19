import { widgetConfig } from "../../../module/student";

export interface Student {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  parentEmail?: string;
  grade: number;
  address?: string;
  role: 'STUDENT';
  isEmailVerified: boolean;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentWithClasses extends Student {
  bookedClasses?: Array<{
    id: string;
    subject: string;
    scheduledAt: string;
    classStatus: string;
    teacher: {
      id: string;
      name: string;
    };
  }>;
}
export interface StudentSearchResult {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  grade: number;
  parentEmail?: string;
}
export interface CreateStudentRequest {
  name: string;
  email: string;
  parentEmail?: string;
  password: string;
  grade: number;
  address?: string;
  region?: string;
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  parentEmail?: string;
  grade?: number;
  address?: string;
  region?: string;
  profilePicture?: string;
}
export type StudentOrderBy = Array<
  Partial<
    Record<string,
      "asc" | "desc"
    >
  >
>;
export interface StudentFilters {
  page?: number;
  limit?: number;
  grade?: number;
  region?: string;
  search?: string;
  orderBy?: StudentOrderBy;
  sortBy?: 'name' | 'email' | 'grade' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface StudentForSelection {
  id: string;
  name: string;
  email: string;
  grade: number;
}

export interface StudentCount {
  total: number;
  byGrade: Record<string, number>;
  byRegion: Record<string, number>;
  emailVerified: number;
  emailUnverified: number;
}

export interface GroupedStudent {
  grade: Record<string, Student[]>;
  region: Record<string, Student[]>;
  emailVerified: {
    verified: Student[];
    unverified: Student[];
  };
}

// For auth integration
export interface StudentAuthData {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT';
  profilePicture?: string;
  grade: number;
  parentEmail?: string;
  region?: string;
}
export interface StudentWidget {
  widgetType: keyof typeof widgetConfig;
  widgetName: string | null;
}