export interface Moderator {
  id: string;
  name: string;
  email: string;
  password?: string;
  address?: string;
  accessControl?: any; // Replace with actual AccessControl type if available
  role: 'MODERATOR';
  profilePicture?: string;
  isEmailVerified: boolean;
  createdAt: string;
} 