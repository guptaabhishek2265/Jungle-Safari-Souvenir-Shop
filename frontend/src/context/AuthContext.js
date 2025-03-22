import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios defaults
  const API_URL = "http://localhost:5000/api";

  // Setup axios request interceptor to add the token
  useEffect(() => {
    // Add a request interceptor to include auth token
    const interceptor = axios.interceptors.request.use(
      (config) => {
        // Only add the Authorization header if we have a token
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup - remove the interceptor when component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setLoading(true);
          // Set auth token in headers
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // For now, we'll just get the user from localStorage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            // If no user in localStorage but token exists, clear token
            localStorage.removeItem("token");
            setToken(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common["Authorization"];
          }
        } catch (err) {
          console.error("Error loading user:", err);
          localStorage.removeItem("token");
          setToken(null);
          setIsAuthenticated(false);
          delete axios.defaults.headers.common["Authorization"];
          setError("Session expired. Please login again.");
        }
        setLoading(false);
      } else {
        delete axios.defaults.headers.common["Authorization"];
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Prevent registering with admin role for security
      if (userData.role === "admin") {
        setLoading(false);
        setError(
          "Admin accounts cannot be created through regular registration"
        );
        throw new Error(
          "Admin accounts cannot be created through regular registration"
        );
      }

      // Simulate API call - in reality you'd connect to your backend
      // const response = await axios.post(`${API_URL}/users/register`, userData);

      // For demo purposes, we'll just store in localStorage
      // Generate fake token
      const fakeToken = `demo-token-${Math.random().toString(36).substr(2, 9)}`;

      // Add timestamp for created date
      const user = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Also store in registered users array
      const storedUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      storedUsers.push(user);
      localStorage.setItem("registeredUsers", JSON.stringify(storedUsers));

      // Update state
      setToken(fakeToken);
      setUser(user);
      setIsAuthenticated(true);

      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
      throw err;
    }
  };

  // Login a user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call - in reality you'd connect to your backend
      // const response = await axios.post(`${API_URL}/users/login`, { email, password });

      // For demo purposes, we'll first check if there's a registered user with this email
      const storedUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      const foundUser = storedUsers.find((u) => u.email === email);

      if (foundUser) {
        // If user exists in registered users, use their data
        // In a real app, you would verify the password hash here
        const fakeToken = `demo-token-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify(foundUser));

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;

        setToken(fakeToken);
        setUser(foundUser);
        setIsAuthenticated(true);
        setLoading(false);
        return foundUser;
      }

      // If no registered user found, check predefined users
      // Admin user
      if (email === "admin@example.com" && password === "password") {
        const fakeToken = `demo-token-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const user = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        };

        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;

        setToken(fakeToken);
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
        return user;
      }
      // Sales user
      else if (email === "sales@example.com" && password === "password") {
        const fakeToken = `demo-token-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const user = {
          id: "2",
          name: "Sales User",
          email: "sales@example.com",
          role: "sales",
        };

        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;

        setToken(fakeToken);
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
        return user;
      }
      // Inventory manager
      else if (email === "inventory@example.com" && password === "password") {
        const fakeToken = `demo-token-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const user = {
          id: "3",
          name: "Inventory Manager",
          email: "inventory@example.com",
          role: "inventory_manager",
        };

        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;

        setToken(fakeToken);
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
        return user;
      } else {
        setLoading(false);
        setError("Invalid email or password");
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || "Login failed");
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    // Clear axios auth header
    delete axios.defaults.headers.common["Authorization"];
  };

  // Special admin login with enhanced security
  const adminLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would hit a dedicated admin API endpoint with additional security
      // For this demo, we'll check the admin credentials directly
      if (email === "abhishek2265@gmail.com" && password === "654321") {
        const fakeToken = `admin-token-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const user = {
          id: "admin-1",
          name: "Abhishek Admin",
          email: "abhishek2265@gmail.com",
          role: "admin",
          loginTime: new Date().toISOString(),
          isAdminLogin: true,
        };

        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Set token in axios headers
        axios.defaults.headers.common["Authorization"] = `Bearer ${fakeToken}`;

        setToken(fakeToken);
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);

        // Log admin login (in a real app, this would go to a secure audit log)
        console.info(
          `Admin login successful: ${email} at ${new Date().toISOString()}`
        );

        return user;
      } else {
        setLoading(false);
        setError("Invalid admin credentials");
        throw new Error("Invalid admin credentials");
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || err.message || "Admin login failed"
      );

      // Log failed attempt (in a real app, this would trigger security alerts)
      console.warn(
        `Admin login attempt failed: ${email} at ${new Date().toISOString()}`
      );

      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export context hook for easier use
export const useAuth = () => useContext(AuthContext);
