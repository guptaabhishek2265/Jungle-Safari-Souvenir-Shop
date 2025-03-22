import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  Inventory as InventoryIcon,
  Group as UsersIcon,
} from "@mui/icons-material";

import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import LowStockAlert from "../../components/dashboard/LowStockAlert";
import PendingOrders from "../../components/dashboard/PendingOrders";

const AdminDashboard = () => {
  const [statsLoading, setStatsLoading] = useState(true);
  const [lowStockLoading, setLowStockLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Sample data for demo purposes
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  // Simulate loading data from API
  useEffect(() => {
    // Simulate API call for stats
    setTimeout(() => {
      setStats({
        totalSales: 24850,
        totalProducts: 128,
        totalOrders: 56,
        totalCustomers: 325,
      });
      setStatsLoading(false);
    }, 1000);

    // Simulate API call for low stock items
    setTimeout(() => {
      setLowStockItems([
        { id: 1, name: "Safari Hat", quantity: 5, reorderLevel: 10 },
        { id: 2, name: "Binoculars", quantity: 2, reorderLevel: 15 },
        { id: 3, name: "Water Bottle", quantity: 8, reorderLevel: 20 },
        { id: 4, name: "Hiking Boots", quantity: 3, reorderLevel: 10 },
      ]);
      setLowStockLoading(false);
    }, 1500);

    // Simulate API call for pending orders
    setTimeout(() => {
      setPendingOrders([
        {
          id: 1,
          orderNumber: "PO-2023-001",
          supplier: "Outdoor Gear Ltd",
          expectedDate: "2023-07-15",
          status: "Pending",
        },
        {
          id: 2,
          orderNumber: "PO-2023-002",
          supplier: "Safari Equipment Co",
          expectedDate: "2023-07-20",
          status: "Approved",
        },
        {
          id: 3,
          orderNumber: "PO-2023-003",
          supplier: "Jungle Supplies",
          expectedDate: "2023-07-25",
          status: "Pending",
        },
      ]);
      setOrdersLoading(false);
    }, 2000);
  }, []);

  // Currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handlers for view all buttons
  const handleViewAllLowStock = () => {
    console.log("Navigate to low stock items page");
    // In a real app, you would navigate to the full low stock items page
    // navigate('/admin/inventory/low-stock');
  };

  const handleViewAllOrders = () => {
    console.log("Navigate to purchase orders page");
    // In a real app, you would navigate to the full purchase orders page
    // navigate('/admin/purchase-orders');
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Sales"
            value={formatCurrency(stats.totalSales)}
            icon={<MoneyIcon />}
            color="#2e7d32"
            loading={statsLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<InventoryIcon />}
            color="#1976d2"
            loading={statsLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<CartIcon />}
            color="#f57c00"
            loading={statsLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<UsersIcon />}
            color="#9c27b0"
            loading={statsLoading}
          />
        </Grid>
      </Grid>

      {/* Alerts and Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LowStockAlert
            items={lowStockItems}
            loading={lowStockLoading}
            onViewAllClick={handleViewAllLowStock}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <PendingOrders
            orders={pendingOrders}
            loading={ordersLoading}
            onViewAllClick={handleViewAllOrders}
          />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default AdminDashboard;
