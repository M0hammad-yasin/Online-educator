import { Class } from "../../classes";

export interface Teacher {
  id: string;
  profilePicture?: string;
  name: string;
  email: string;
  qualification?: string;
  classRate?: number;
  classes?: Class[]; // Replace with actual Class type if available
  role: 'TEACHER';
  password?: string;
  address?: string;
  accessControl?: any; // Replace with actual AccessControl type if available
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface TeacherSearchResult {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  qualification?: string;
  classRate?: number;
}
export interface TeacherWithClasses extends Teacher {
  scheduledClasses?: Array<{
    id: string;
    subject: string;
    scheduledAt: string;
    classStatus: string;
    student: {
      id: string;
      name: string;
    };
  }>;
}

export interface CreateTeacherRequest {
  name: string;
  email: string;
  password: string;
  qualification?: string;
  classRate?: number;
  address?: string;
}

export interface UpdateTeacherRequest {
  name?: string;
  email?: string;
  qualification?: string;
  classRate?: number;
  address?: string;
  profilePicture?: string;
}

export interface TeacherFilters {
  page?: number;
  limit?: number;
  qualification?: string;
  classRate?: number;
  search?: string;
  sortBy?: 'name' | 'email' | 'qualification' | 'classRate' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface TeacherForSelection {
  id: string;
  name: string;
  email: string;
  qualification?: string;
  classRate?: number;
}

export interface TeacherCount {
  total: number;
  byQualification: Record<string, number>;
  byClassRate: Record<string, number>;
  emailVerified: number;
  emailUnverified: number;
}

export interface GroupedTeacher {
  qualification: Record<string, Teacher[]>;
  classRate: Record<string, Teacher[]>;
  emailVerified: {
    verified: Teacher[];
    unverified: Teacher[];
  };
}

// For auth integration
export interface TeacherAuthData {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER';
  profilePicture?: string;
  qualification?: string;
  classRate?: number;
}