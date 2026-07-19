import { api } from './api';
import * as SecureStore from 'expo-secure-store';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../utils/types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      await SecureStore.setItemAsync('token', response.data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    if (response.data.token) {
      await SecureStore.setItemAsync('token', response.data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  },

  getCurrentUser: async () => {
    const userStr = await SecureStore.getItemAsync('user');
    if (!userStr) return null;
    return JSON.parse(userStr) as Omit<AuthResponse, 'token'>;
  }
};
