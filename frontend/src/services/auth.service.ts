import { api } from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../utils/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get<string>(`/auth/verify?token=${token}`);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
