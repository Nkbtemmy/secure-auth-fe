import axios from 'axios';
import { getToken, logout } from '../utils/auth';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.secure.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - logout user
      logout();
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const loginUser = async (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = async (name: string, email: string, password: string) => {
  return api.post('/auth/register', { name, email, password });
};

// User API calls
export const getUserProfile = async () => {
  const token = getToken();
  return api.get('/users/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserProfile = async (userData: unknown) => {
  const token = getToken();
  return api.put('/users/me', userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Dashboard API calls
export const getDashboardData = async () => {
  const token = getToken();
  return api.get('/dashboard', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getUsers = async () => {
  const token = getToken();
  return api.get('/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiAddUser = async (userData: unknown) => {
  const token = getToken();
  return api.post('/users', userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiUpdateUser = async (userId: number, userData: unknown) => {
  const token = getToken();
  return api.put(`/users/${userId}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateUserRole = async (userId: number, role: string) => {
  const token = getToken();
  return api.put(`/users/${userId}/role`, { role }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const apiDeleteUser = async (userId: number) => {
  const token = getToken();
  return api.delete(`/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getRoles = async () => {
  const token = getToken();
  return api.get('/roles', {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default api;