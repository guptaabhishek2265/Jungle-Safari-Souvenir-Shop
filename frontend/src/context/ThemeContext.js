import React, { createContext, useState, useEffect, useContext } from "react";

// Create the theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if there's a saved theme preference in localStorage
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return savedTheme ? savedTheme === "dark" : true; // Default to dark theme
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem("appTheme", newTheme ? "dark" : "light");
  };

  // Apply theme class to body when theme changes
  useEffect(() => {
    if (!isDarkTheme) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => useContext(ThemeContext);
