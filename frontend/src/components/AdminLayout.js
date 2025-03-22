import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./common/Layout";
import { Box, Alert } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";

const AdminLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify the user is authenticated as admin and came through admin login
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/access-required");
      return;
    }

    // Check if the admin used the admin login portal
    if (!user.isAdminLogin) {
      navigate("/admin/access-required", {
        state: {
          message:
            "Please use the admin login portal for enhanced security access.",
          from: window.location.pathname,
        },
      });
    }
  }, [isAuthenticated, user, navigate]);

  // If checks pass, render the normal layout with the admin content and a visual indicator
  return (
    <>
      <Box
        sx={{
          borderTop: "4px solid #64FFDA",
          position: "relative",
          zIndex: 1200,
        }}
      >
        <Alert
          icon={<AdminPanelSettings />}
          severity="info"
          sx={{
            borderRadius: 0,
            backgroundColor: "rgba(100, 255, 218, 0.1)",
            color: "#64FFDA",
            "& .MuiAlert-icon": {
              color: "#64FFDA",
            },
          }}
        >
          Admin Mode - Enhanced Security Session
        </Alert>
      </Box>
      <Layout />
    </>
  );
};

export default AdminLayout;
