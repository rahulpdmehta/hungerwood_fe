import axios from 'axios';
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from '@utils/constants';
import useAuthStore from '@store/useAuthStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  config => {
    // Get token from Zustand store (persisted in localStorage)
    const authData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // Handle errors globally
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    // Handle unauthorized (401) errors
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    // Handle forbidden (403) errors
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle not found (404) errors
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle server (500+) errors
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
