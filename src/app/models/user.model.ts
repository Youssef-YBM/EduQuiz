export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  banned: boolean;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}