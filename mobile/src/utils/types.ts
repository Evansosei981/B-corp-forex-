export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'ADMIN' | 'USER';
}

export interface Course {
  id?: number;
  title: string;
  description: string;
  price: number;
  difficultyLevel?: string;
  thumbnailUrl?: string;
}
