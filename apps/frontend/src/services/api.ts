import axios from 'axios';
import type { TierList, Logo, TierCategory } from '@godtier/shared';

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
  getMyLists: async () => {
    const response = await api.get<TierList[]>('/tier-lists/my-lists');
    return response.data;
  },
  create: async (data: { title: string; description?: string }) => {
    const response = await api.post<TierList>('/tier-lists', data);
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get<TierList>(`/tier-lists/${id}`);
    return response.data;
  },
  addLogo: async (tierListId: string, data: { id: string; name: string; imageUrl: string; category: TierCategory }) => {
    const response = await api.post<TierList>(`/tier-lists/${tierListId}/logos`, data);
    return response.data;
  },
  moveLogo: async (tierListId: string, data: { logoId: string; categoryId: TierCategory }) => {
    const response = await api.patch<TierList>(`/tier-lists/${tierListId}/logos/move`, data);
    return response.data;
  }
};

export const logoApi = {
    getAll: async () => {
        const response = await api.get<Logo[]>('/logos');
        return response.data;
    },
    create: async (data: { title: string; imageUrl: string }) => {
        const response = await api.post<Logo>('/logos', data);
        return response.data;
    }
};
