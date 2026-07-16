import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle unauthorized access and clear local storage if expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid, redirect or clear state if necessary
      console.warn('Unauthorized request, user session may have expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
