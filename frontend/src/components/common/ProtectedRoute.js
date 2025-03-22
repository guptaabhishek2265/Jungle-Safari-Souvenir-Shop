import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin" />;
    } else if (user.role === "sales") {
      return <Navigate to="/sales" />;
    } else if (user.role === "inventory_manager") {
      return <Navigate to="/inventory" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return element;
};

export default ProtectedRoute;
