import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HttpOnly refresh tokens / cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In Phase 2, we will attach in-memory Access Token here
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<{ success: boolean; error?: { message?: string; code?: string } }>) => {
    const customMessage = error.response?.data?.error?.message;
    if (customMessage) {
      error.message = customMessage;
    }
    return Promise.reject(error);
  }
);
