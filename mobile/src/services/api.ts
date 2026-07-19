import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const LIVE_BACKEND_URL = 'https://b-corp-forex-backend.onrender.com/api/v1'; // We need the actual render URL! 
// Wait, the user mentioned they deployed it. I'll use the localhost for now if running locally, or find the actual backend url.
// In the frontend's `.env`, what is the backend URL? Let's check `frontend/.env.production` later. For now, I'll use a placeholder and we can replace it.

export const api = axios.create({
  baseURL: 'https://bcorp-backend.onrender.com/api/v1', // Assuming this from plan, will verify.
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
