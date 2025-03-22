import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
  PointOfSale as POSIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleProfileMenuClose();
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Navigation links based on user role
  const getNavigationLinks = () => {
    if (!isAuthenticated) {
      return [
        { text: "Login", icon: <LogoutIcon />, path: "/login" },
        { text: "Register", icon: <PeopleIcon />, path: "/register" },
      ];
    }

    const links = [];

    // Admin links
    if (user?.role === "admin") {
      links.push({
        text: "Admin Dashboard",
        icon: <DashboardIcon />,
        path: "/admin",
      });
    }

    // Sales links
    if (user?.role === "admin" || user?.role === "sales") {
      links.push(
        { text: "Sales Dashboard", icon: <DashboardIcon />, path: "/sales" },
        { text: "Point of Sale", icon: <POSIcon />, path: "/pos" }
      );
    }

    // Inventory links
    if (user?.role === "admin" || user?.role === "inventory_manager") {
      links.push(
        {
          text: "Inventory Dashboard",
          icon: <DashboardIcon />,
          path: "/inventory",
        },
        {
          text: "Product Management",
          icon: <InventoryIcon />,
          path: "/inventory/products",
        },
        {
          text: "Supplier Management",
          icon: <BusinessIcon />,
          path: "/inventory/suppliers",
        },
        {
          text: "Purchase Orders",
          icon: <LocalShippingIcon />,
          path: "/inventory/purchase-orders",
        }
      );
    }

    return links;
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" noWrap component="div" color="primary">
          Jungle Safari
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getNavigationLinks().map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Don't show the layout for login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.role
              ? `${
                  user.role.charAt(0).toUpperCase() + user.role.slice(1)
                } Dashboard`
              : "Jungle Safari Inventory"}
          </Typography>
          {isAuthenticated && (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                >
                  {getInitials(user?.name)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="subtitle2">
                    {user?.name || "User"}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProfileMenuClose}>
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
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation drawer"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
