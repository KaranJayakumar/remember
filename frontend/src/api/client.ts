import { useAuth } from '@clerk/clerk-expo';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: `${process.env.EXPO_BASE_API_URL}/api/`,
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' }
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const { getToken } = useAuth()
    const apiToken = getToken()

    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;

