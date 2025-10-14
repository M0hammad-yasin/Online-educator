export interface Teacher {
  id: string;
  profilePicture?: string;
  name: string;
  email: string;
  qualification?: string;
  classRate?: number;
  classes?: any[]; // Replace with actual Class type if available
  role: 'TEACHER';
  password?: string;
  address?: string;
  accessControl?: any; // Replace with actual AccessControl type if available
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
} 