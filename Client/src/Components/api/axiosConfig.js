import axios from 'axios';
import { clearAuth } from '../utils/cookieUtils';

// Create axios instance for development
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Development server
  withCredentials: true, // This allows cookies to be sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// No need for request interceptor since server reads cookies directly
// The server will automatically read the HTTP-only cookie from the request

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth
      if (typeof window !== 'undefined') {
        clearAuth();
        // Don't redirect here - let the component handle it
        // This prevents infinite loops
      }
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default apiClient;

// Export axios for backward compatibility
export { axios };
