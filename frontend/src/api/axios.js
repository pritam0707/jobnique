import axios from "axios";

// Updated fallback URL to match Express server (Port 4000 & /api/v1)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enables cookie-based session handling
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Authorization Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global API errors (e.g., Session Expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if session is expired/invalid
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;