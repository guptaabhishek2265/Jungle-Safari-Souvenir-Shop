import React, { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Button,
  Drawer,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  PointOfSale as SalesIcon,
  ShoppingCart as PurchaseOrdersIcon,
  Store as SuppliersIcon,
  People as CustomersIcon,
  Person as UsersIcon,
  Logout as LogoutIcon,
  LocalShipping as PurchaseIcon,
  Business as SupplierIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth = 240 }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: `/${
        user?.role === "admin"
          ? "admin"
          : user?.role === "sales"
          ? "sales"
          : "inventory"
      }`,
      roles: ["admin", "sales", "inventory_manager"],
    },
    {
      text: "Products",
      icon: <InventoryIcon />,
      path:
        user?.role === "inventory_manager" || user?.role === "admin"
          ? "/inventory/products"
          : "/products",
      roles: ["admin", "inventory_manager", "sales"],
    },
    {
      text: "Sales",
      icon: <SalesIcon />,
      path: "/sales/reports",
      roles: ["admin", "sales"],
    },
    {
      text: "Purchase Orders",
      icon: <PurchaseIcon />,
      path: "/purchase-orders",
      roles: ["admin", "inventory_manager"],
    },
    {
      text: "Suppliers",
      icon: <SupplierIcon />,
      path: "/suppliers",
      roles: ["admin", "inventory_manager"],
    },
    {
      text: "Customers",
      icon: <CustomersIcon />,
      path: "/customers",
      roles: ["admin", "sales"],
    },
    {
      text: "User Management",
      icon: <AdminIcon />,
      path: "/users",
      roles: ["admin"],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const drawer = (
    <div>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Jungle Safari
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Inventory Management
        </Typography>
      </Box>

      <List sx={{ pt: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              backgroundColor:
                location.pathname === item.path
                  ? theme.palette.action.selected
                  : "transparent",
              borderLeft:
                location.pathname === item.path
                  ? `4px solid ${theme.palette.primary.main}`
                  : "4px solid transparent",
              pl: 2,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path
                    ? theme.palette.primary.main
                    : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 2 }} />

      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </div>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
