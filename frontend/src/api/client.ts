import axios, { InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BASE_API_URL}`,
  timeout: 1000,
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log("🚀 REQUEST:");
  const url = `${config.baseURL ?? ''}${config.url ?? ''}`;
  console.log("URL:", url);
  console.log("Method:", config.method);
  console.log("Headers:", config.headers);
  console.log("Data:", config.data);
  return config;
}, (error) => {
  console.error("❌ REQUEST ERROR:", error);
  return Promise.reject(error);
});

export default client;
