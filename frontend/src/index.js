import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { InventoryProvider } from "./pages/inventory/Dashboard";
import { AuthProvider } from "./context/AuthContext";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32", // Forest green for jungle theme
      lighter: "#e8f5e9", // Light green for backgrounds
    },
    secondary: {
      main: "#f57c00", // Orange for contrast
      lighter: "#fff3e0", // Light orange for backgrounds
    },
    success: {
      main: "#4caf50",
      lighter: "#e8f5e9",
    },
    warning: {
      main: "#ff9800",
      lighter: "#fff3e0",
    },
    error: {
      main: "#f44336",
      lighter: "#ffebee",
    },
    info: {
      main: "#2196f3",
      lighter: "#e3f2fd",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <InventoryProvider>
            <App />
          </InventoryProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
