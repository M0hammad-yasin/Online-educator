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
export interface ModeratorAccessControl {
  id: string;
  moderator: Moderator;
  moderatorId: string;
  // Permissions for class , teacher and student management

  canSeeTeacher: boolean;
  canAddTeacher: boolean;
  canUpdateTeacher: boolean;
  canDeleteTeacher: boolean;

  canSeeClass: boolean;
  canAddClass: boolean;
  canUpdateClass: boolean;
  canDeleteClass: boolean;

  canSeeStudent: boolean;
  canAddStudent: boolean;
  canUpdateStudent: boolean;
  canDeleteStudent: boolean;
  createdAt: Date;
  updatedAt: Date;
}