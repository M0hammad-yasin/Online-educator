export interface Admin {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'ADMIN';
    profilePicture?: string;
    isEmailVerified: boolean;
    createdAt: string;
  } 