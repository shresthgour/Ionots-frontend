import axios from 'axios';

const API_BASE_URL = process.env.API;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Log when the API connection is established
axiosInstance.interceptors.request.use((config) => {
  console.log('API Connection Established', {
    baseURL: config.baseURL,
    method: config.method,
    url: config.url
  });
  return config;
});