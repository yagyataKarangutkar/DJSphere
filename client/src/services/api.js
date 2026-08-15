import axios from 'axios';

// Create a centralized Axios instance configured for DJSphere backend
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Enables sending and receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
