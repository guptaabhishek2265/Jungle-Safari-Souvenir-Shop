import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import {
  Point,
  Timeline,
  MonetizationOn,
  ShoppingCart,
  TrendingUp,
  PeopleAlt,
  CalendarToday,
  Paid,
  Logout,
} from "@mui/icons-material";
import Chart from "react-apexcharts";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const SalesDashboard = () => {
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrder: 0,
    recentSales: [],
  });

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    // Fetch sales data
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const response = await api.get('/api/sales/dashboard');
        // setSalesData(response.data);

        // Mock data for demonstration
        setTimeout(() => {
          setSalesData({
            totalSales: 68750,
            totalOrders: 42,
            averageOrder: 1637,
            recentSales: [
              {
                id: "ORD-1234",
                date: "2023-05-15T10:30:00",
                customer: { name: "Rahul Sharma" },
                amount: 2450,
                items: 3,
                status: "completed",
              },
              {
                id: "ORD-1235",
                date: "2023-05-15T11:45:00",
                customer: { name: "Priya Patel" },
                amount: 1850,
                items: 2,
                status: "completed",
              },
              {
                id: "ORD-1236",
                date: "2023-05-14T14:20:00",
                customer: { name: "Amit Kumar" },
                amount: 3200,
                items: 4,
                status: "completed",
              },
              {
                id: "ORD-1237",
                date: "2023-05-14T16:10:00",
                customer: { name: "Sunita Desai" },
                amount: 1100,
                items: 1,
                status: "completed",
              },
              {
                id: "ORD-1238",
                date: "2023-05-13T09:45:00",
                customer: { name: "Vikram Singh" },
                amount: 4500,
                items: 5,
                status: "completed",
              },
            ],
            chartData: {
              sales: [12500, 15000, 10800, 8900, 21550],
              categories: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
            },
            topProducts: [
              { name: "Safari Hat", sales: 18, amount: 10782 },
              { name: "Binoculars", sales: 12, amount: 23988 },
              { name: "Water Bottle", sales: 24, amount: 10800 },
              { name: "Trail Mix", sales: 36, amount: 4320 },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Format time
  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString("en-US", options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Sales chart options
  const chartOptions = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#4C51BF"],
    xaxis: {
      categories: salesData.chartData?.categories || [],
      labels: {
        style: { colors: "#718096", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
        style: { colors: "#718096", fontSize: "12px" },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
      },
    },
    markers: { size: 5, colors: ["#4C51BF"], strokeWidth: 0 },
    grid: { borderColor: "#f1f1f1" },
  };

  const chartSeries = [
    {
      name: "Sales",
      data: salesData.chartData?.sales || [],
    },
  ];

  // Content to render
  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sales Dashboard
        </Typography>
        <Box>
          <Button
            component={Link}
            to="/pos"
            variant="contained"
            startIcon={<Point />}
            sx={{ backgroundColor: "#4C51BF", mr: 2 }}
          >
            Open POS
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ bgcolor: "#4C51BF", color: "white" }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                        Total Sales
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mt: 1 }}
                      >
                        {formatCurrency(salesData.totalSales)}
                      </Typography>
                    </Box>
                    <MonetizationOn sx={{ fontSize: 48, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Total Orders
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mt: 1 }}
                      >
                        {salesData.totalOrders}
                      </Typography>
                    </Box>
                    <ShoppingCart
                      sx={{ fontSize: 48, opacity: 0.6, color: "primary.main" }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Average Order Value
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mt: 1 }}
                      >
                        {formatCurrency(salesData.averageOrder)}
                      </Typography>
                    </Box>
                    <Paid
                      sx={{ fontSize: 48, opacity: 0.6, color: "primary.main" }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart and Top Products */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">
                    <TrendingUp
                      sx={{
                        mr: 1,
                        verticalAlign: "middle",
                        color: "primary.main",
                      }}
                    />
                    Sales Trend
                  </Typography>
                  <Box>
                    <Chip
                      size="small"
                      label="This Week"
                      color="primary"
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                  </Box>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="line"
                  height={320}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  <Timeline
                    sx={{
                      mr: 1,
                      verticalAlign: "middle",
                      color: "primary.main",
                    }}
                  />
                  Top Selling Products
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {salesData.topProducts?.map((product, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem sx={{ py: 1.5 }}>
                        <ListItemText
                          primary={product.name}
                          secondary={`${product.sales} units sold`}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(product.amount)}
                        </Typography>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Sales */}
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                <PeopleAlt
                  sx={{ mr: 1, verticalAlign: "middle", color: "primary.main" }}
                />
                Recent Sales
              </Typography>
              <Button
                variant="outlined"
                size="small"
                component={Link}
                to="/sales/new"
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesData.recentSales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {formatDate(sale.date)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(sale.date)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{sale.customer.name}</TableCell>
                      <TableCell>{sale.items} items</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(sale.amount)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            sale.status === "completed"
                              ? "Completed"
                              : "Pending"
                          }
                          color={
                            sale.status === "completed" ? "success" : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default SalesDashboard;
