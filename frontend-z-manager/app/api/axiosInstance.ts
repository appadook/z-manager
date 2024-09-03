// app/api/axiosInstance.ts

import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL for your Spring Boot API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for request/response handling
api.interceptors.request.use(
  (config) => {
    // Add any custom logic before the request is sent, like attaching a token
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Any custom logic for handling responses
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  }
);

export default api;
