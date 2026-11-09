import axios from 'axios';

const isBrowser = typeof window !== 'undefined';
const isVercelHost = isBrowser && window.location.hostname.endsWith('vercel.app');

// Determine API base URL:
// 1. If running on Vercel (*.vercel.app), ALWAYS use relative '/api' so requests route to same domain
// 2. Otherwise if VITE_API_URL is provided and not a placeholder/onrender, use it
// 3. Otherwise in local dev use 'http://localhost:5000/api', or in production '/api'
let API_BASE_URL = '/api';

if (isVercelHost) {
  API_BASE_URL = '/api';
} else if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('onrender.com')) {
  API_BASE_URL = import.meta.env.VITE_API_URL;
} else if (!import.meta.env.PROD && isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  API_BASE_URL = 'http://localhost:5000/api';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use((response) => response.data, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return Promise.reject(error.response ? error.response.data : error);
});

export default api;
