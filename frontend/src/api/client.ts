import { useAuth } from '@clerk/clerk-expo';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: `${process.env.EXPO_BASE_API_URL}`,
  timeout: 1000,
});

export default client;
