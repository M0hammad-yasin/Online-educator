export interface Student {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  parentEmail?: string;
  grade: number;
  password?: string;
  address?: string;
  role: 'STUDENT';
  isEmailVerified: boolean;
  createdAt: string;
  bookedClasses?: any[]; // Replace with actual Class type if available
  region?: string;
} 