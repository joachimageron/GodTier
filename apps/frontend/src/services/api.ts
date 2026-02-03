import axios from 'axios';
import type { TierList } from '@godtier/shared';

// Types
export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface SignupDto {
  email: string;
  password: string;
  name?: string;
}

export interface SigninDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

// Axios instance
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth helper
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API calls
export const authApi = {
  signup: async (data: SignupDto) => {
    const response = await api.post<User>('/auth/signup', data);
    return response.data;
  },
  login: async (data: SigninDto) => {
    const response = await api.post<AuthResponse>('/auth/signin', data);
    return response.data;
  },
};

export const tierListApi = {
  getAll: async () => {
    const response = await api.get<TierList[]>('/tier-lists');
    return response.data;
  },
};
