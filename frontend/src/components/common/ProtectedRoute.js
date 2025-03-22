import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  // Check if trying to access an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // If not authenticated, redirect
  if (!isAuthenticated) {
    // Redirect to admin login for admin routes
    if (isAdminRoute) {
      return (
        <Navigate to="/admin/access-required" state={{ from: location }} />
      );
    }
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If authenticated but not authorized for this route
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // For admin routes, check if admin logged in through admin login
    if (isAdminRoute && user.role !== "admin") {
      return (
        <Navigate
          to="/admin/access-required"
          state={{
            from: location,
            message: "You don't have permission to access the admin area.",
          }}
        />
      );
    }

    // Otherwise, redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === "sales") {
      return <Navigate to="/sales/dashboard" />;
    } else if (user.role === "inventory_manager") {
      return <Navigate to="/inventory/dashboard" />;
    } else if (user.role === "customer") {
      return <Navigate to="/customer" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  // If the user is accessing an admin route, verify they came through the admin login
  if (isAdminRoute && user.role === "admin" && !user.isAdminLogin) {
    return (
      <Navigate
        to="/admin/access-required"
        state={{
          from: location,
          message:
            "Please login through the admin portal for enhanced security access.",
        }}
      />
    );
  }

  return element;
};

export default ProtectedRoute;
