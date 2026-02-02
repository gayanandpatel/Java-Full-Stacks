import axios from "axios";
import { logoutUser } from "./authService";

// Use environment variable with a fallback for local development
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1";

// Public API client (no auth needed)
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Private API client (requires auth)
export const privateApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Concurrency Handling Variables ---
let isRefreshing = false;
let failedQueue = [];

// Helper to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attaches Token
privateApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handles Token Refresh
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Also apply the safe header update here for queued requests
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            } else {
              originalRequest.headers = { Authorization: `Bearer ${token}` };
            }
            return privateApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await api.post("/auth/refresh-token");
        const newAccessToken = response.data.accessToken;

        // Store new token
        localStorage.setItem("authToken", newAccessToken);
        
        // --- SAFE HEADER UPDATE (Implemented as requested) ---
        if (originalRequest.headers) {
             originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        } else {
             originalRequest.headers = { Authorization: `Bearer ${newAccessToken}` };
        }

        // Process any queued requests with the new token
        processQueue(null, newAccessToken);

        // Return the original request execution
        return privateApi(originalRequest);

      } catch (refreshError) {
        // If refresh fails, reject all queued requests
        processQueue(refreshError, null);
        
        // Redirect to Login with "Session Expired" message
        logoutUser(); 
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);