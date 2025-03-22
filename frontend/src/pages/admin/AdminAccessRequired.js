import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import {
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material";

const AdminAccessRequired = () => {
  const location = useLocation();
  const message =
    location.state?.message ||
    "You need to login through the admin portal to access this content.";
  const returnPath = location.state?.from?.pathname || "/admin/login";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/images/img8.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(10, 25, 41, 0.9)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            color: "#fff",
            border: "1px solid rgba(81, 81, 81, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <ErrorIcon color="error" sx={{ fontSize: 36, mr: 1 }} />
            <Typography
              variant="h5"
              component="h1"
              color="error"
              fontWeight="bold"
            >
              Admin Access Required
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              padding: 2,
              borderRadius: 1,
              width: "100%",
              mb: 3,
            }}
          >
            <Typography align="center">{message}</Typography>
          </Box>

          <AdminIcon
            sx={{ fontSize: 80, color: "rgba(255, 255, 255, 0.2)", mb: 2 }}
          />

          <Typography variant="body1" paragraph align="center">
            For security reasons, administrator access requires a dedicated
            login process. This helps us maintain a secure system and protect
            sensitive information.
          </Typography>

          <Typography
            variant="body2"
            paragraph
            align="center"
            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          >
            Administrator accounts are created by system administrators and
            cannot be self-registered. If you need admin access, please contact
            system support.
          </Typography>

          <Divider
            sx={{
              width: "100%",
              my: 2,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
            }}
          >
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBackIcon />}
              sx={{ flex: 1 }}
            >
              Back to Regular Login
            </Button>

            <Button
              component={Link}
              to="/admin/login"
              variant="contained"
              color="primary"
              startIcon={<LockOpenIcon />}
              sx={{
                flex: 1,
                backgroundColor: "#64FFDA",
                color: "#0A1929",
                "&:hover": {
                  backgroundColor: "#76d7c4",
                },
              }}
            >
              Go to Admin Login
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
            <SecurityIcon
              sx={{ fontSize: 16, color: "rgba(255, 255, 255, 0.5)", mr: 1 }}
            />
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
              Enhanced security measures in place
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminAccessRequired;
