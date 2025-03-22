import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Brightness7 as LightModeIcon,
  Brightness4 as DarkModeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenu = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
        mb: 3,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          {user?.role
            ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel`
            : "Jungle Safari"}
        </Typography>

        {/* Theme Toggle */}
        <Box className="theme-toggle" onClick={toggleTheme}>
          {isDarkTheme ? (
            <LightModeIcon className="theme-toggle-icon" sx={{ mr: 1 }} />
          ) : (
            <DarkModeIcon className="theme-toggle-icon" sx={{ mr: 1 }} />
          )}
          <label className="theme-toggle-switch">
            <input
              type="checkbox"
              checked={!isDarkTheme}
              onChange={toggleTheme}
            />
            <span className="theme-toggle-slider"></span>
          </label>
        </Box>

        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
          onClick={handleNotifMenu}
        >
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          id="menu-notif"
          anchorEl={notifAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(notifAnchorEl)}
          onClose={handleNotifClose}
        >
          <MenuItem onClick={handleNotifClose}>
            <ListItemText primary="New order #1234" secondary="2 minutes ago" />
          </MenuItem>
          <MenuItem onClick={handleNotifClose}>
            <ListItemText
              primary="Low stock alert: Tiger plush toy"
              secondary="15 minutes ago"
            />
          </MenuItem>
          <MenuItem onClick={handleNotifClose}>
            <ListItemText
              primary="Payment received from order #1233"
              secondary="1 hour ago"
            />
          </MenuItem>
        </Menu>

        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "primary.main",
            }}
          >
            {getInitials(user?.name)}
          </Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem disabled>
            <Typography variant="subtitle2">{user?.name || "User"}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigate("/settings")}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
