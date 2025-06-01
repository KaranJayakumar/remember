import axios, {AxiosResponse, InternalAxiosRequestConfig } from 'axios';

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

client.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("📦 RESPONSE:");
    const url = `${response.config.baseURL ?? ''}${response.config.url ?? ''}`;
    console.log("URL:", url);
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ RESPONSE ERROR:", error);
    return Promise.reject(error);
  }
);


export default client;
