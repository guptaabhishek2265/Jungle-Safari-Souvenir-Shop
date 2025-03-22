import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import SalesDashboard from "../pages/sales/SalesDashboard";
import InventoryDashboard from "../pages/inventory/InventoryDashboard";
import ProductManagement from "../pages/inventory/ProductManagement";
import SupplierManagement from "../pages/inventory/SupplierManagement";
import PurchaseOrderManagement from "../pages/inventory/PurchaseOrderManagement";
import LowStockAlert from "../pages/inventory/LowStockAlert";
import CustomerDashboard from "../pages/customer/Dashboard";

// Define routes with role-based access
const routes = [
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      // Admin routes
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
        roles: ["admin"],
      },

      // Sales routes
      {
        path: "sales/dashboard",
        element: <SalesDashboard />,
        roles: ["sales", "admin"],
      },

      // Customer route
      {
        path: "customer",
        element: <CustomerDashboard />,
        roles: ["sales", "admin", "customer"],
      },
      {
        path: "customer/products",
        element: <CustomerDashboard />,
        roles: ["customer", "sales", "admin"],
      },
      {
        path: "customer/orders",
        element: <CustomerDashboard />,
        roles: ["customer", "sales", "admin"],
      },

      // Inventory routes
      {
        path: "inventory/dashboard",
        element: <InventoryDashboard />,
        roles: ["inventory_manager", "admin"],
      },
      {
        path: "inventory/products",
        element: <ProductManagement />,
        roles: ["inventory_manager", "admin"],
      },
      {
        path: "inventory/suppliers",
        element: <SupplierManagement />,
        roles: ["inventory_manager", "admin"],
      },
      {
        path: "inventory/purchase-orders",
        element: <PurchaseOrderManagement />,
        roles: ["inventory_manager", "admin"],
      },
      {
        path: "inventory/low-stock",
        element: <LowStockAlert />,
        roles: ["inventory_manager", "admin"],
      },

      // Default route for authenticated users (based on role)
      {
        path: "dashboard",
        element: <Navigate to="/admin/dashboard" replace />,
        roles: ["admin"],
      },
      {
        path: "dashboard",
        element: <Navigate to="/sales/dashboard" replace />,
        roles: ["sales"],
      },
      {
        path: "dashboard",
        element: <Navigate to="/inventory/dashboard" replace />,
        roles: ["inventory_manager"],
      },
      {
        path: "dashboard",
        element: <Navigate to="/customer" replace />,
        roles: ["customer"],
      },
    ],
  },
  // Catch-all route for undefined paths
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
];

export default routes;
