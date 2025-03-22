import axios from "axios";

// Create an instance of axios with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common error cases
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle session expiration or unauthorized access
    if (error.response && error.response.status === 401) {
      // Clear saved token and redirect to login page
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Handle server errors with a more specific message
    if (error.response && error.response.status >= 500) {
      console.error("Server error occurred:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
