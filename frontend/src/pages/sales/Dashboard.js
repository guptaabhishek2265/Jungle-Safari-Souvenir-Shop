import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  alpha,
  Container,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  CalendarMonth as CalendarIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import DashboardLayout from "../../components/common/DashboardLayout";
import StatsCard from "../../components/dashboard/StatsCard";
import { InventoryContext } from "../inventory/Dashboard";
import SalesChart from "../../components/dashboard/SalesChart";
import TopSellingProducts from "../../components/dashboard/TopSellingProducts";
import "../../components/dashboard/animations.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Custom styled component for dark background with img7
const DarkOverlay = ({ children }) => (
  <Box
    sx={{
      position: "relative",
      zIndex: 1,
      minHeight: "100vh",
      width: "100%",
      "&::before": {
        content: '""',
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/images/img7.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        filter: "brightness(0.3)",
        zIndex: -1,
      },
    }}
  >
    {children}
  </Box>
);

const SalesDashboard = () => {
  const navigate = useNavigate();
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentSalesLoading, setRecentSalesLoading] = useState(true);
  const [recentSales, setRecentSales] = useState([]);
  const inventoryContext = useContext(InventoryContext);
  const [simulateSaleDialogOpen, setSimulateSaleDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Real-time sales data starting at 0
  const [stats, setStats] = useState({
    dailySales: 0,
    monthlySales: 0,
    totalProducts: 0,
    customerCount: 0,
  });

  // Load initial data and set up listeners
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "newProductAdded") {
        const newProduct = JSON.parse(e.newValue);
        setStats((prevStats) => ({
          ...prevStats,
          totalProducts: prevStats.totalProducts + 1,
        }));
      } else if (e.key === "newSale") {
        const saleData = JSON.parse(e.newValue);
        processSale(saleData);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Initialize date information
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Initialize tracked customers if not present
    const trackedCustomers = JSON.parse(
      localStorage.getItem("tracked-customers") || '{"daily":{},"monthly":{}}'
    );
    if (!trackedCustomers.daily[today]) {
      trackedCustomers.daily[today] = [];
    }
    if (!trackedCustomers.monthly[currentMonth]) {
      trackedCustomers.monthly[currentMonth] = [];
    }
    localStorage.setItem("tracked-customers", JSON.stringify(trackedCustomers));

    // Load initial product count from inventory context if available
    if (inventoryContext && inventoryContext.stats) {
      setStats((prevStats) => ({
        ...prevStats,
        totalProducts: inventoryContext.stats.totalProducts || 0,
      }));
    } else {
      // Try to get products count from localStorage
      const storedProducts = localStorage.getItem("inventory-products");
      if (storedProducts) {
        try {
          const products = JSON.parse(storedProducts);
          setStats((prevStats) => ({
            ...prevStats,
            totalProducts: products.length,
          }));
        } catch (err) {
          console.error("Error parsing stored products:", err);
        }
      }
    }

    // Load saved sales stats from localStorage
    const savedStats = localStorage.getItem("sales-stats");
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setStats((prevStats) => ({
          ...prevStats,
          ...parsedStats,
        }));
      } catch (err) {
        console.error("Error parsing saved sales stats:", err);
      }
    }

    // Load saved recent sales from localStorage
    const savedRecentSales = localStorage.getItem("recent-sales");
    if (savedRecentSales) {
      try {
        const parsedRecentSales = JSON.parse(savedRecentSales);
        setRecentSales(parsedRecentSales);
      } catch (err) {
        console.error("Error parsing saved recent sales:", err);
      }
    }

    setStatsLoading(false);
    setRecentSalesLoading(false);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [inventoryContext]);

  // Process a new sale
  const processSale = (saleData) => {
    // Get current date information
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;

    // Load tracked customers from localStorage
    const trackedCustomers = JSON.parse(
      localStorage.getItem("tracked-customers") || '{"daily":{},"monthly":{}}'
    );

    // Check if customer is unique for today/month
    const customerId = saleData.customer?.id || "guest";
    const isNewDailyCustomer =
      !trackedCustomers.daily[today]?.includes(customerId);
    const isNewMonthlyCustomer =
      !trackedCustomers.monthly[currentMonth]?.includes(customerId);

    // Update tracked customers
    if (!trackedCustomers.daily[today]) {
      trackedCustomers.daily[today] = [];
    }
    if (!trackedCustomers.monthly[currentMonth]) {
      trackedCustomers.monthly[currentMonth] = [];
    }

    // Add customer to tracked lists if they're new
    if (isNewDailyCustomer) {
      trackedCustomers.daily[today].push(customerId);
    }
    if (isNewMonthlyCustomer) {
      trackedCustomers.monthly[currentMonth].push(customerId);
    }

    // Save updated tracked customers
    localStorage.setItem("tracked-customers", JSON.stringify(trackedCustomers));

    // Check if sale happened today
    const saleDate = new Date(saleData.timestamp || now);
    const saleDay = saleDate.toISOString().split("T")[0];
    const saleMonth = `${saleDate.getFullYear()}-${String(
      saleDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const isTodaySale = saleDay === today;
    const isCurrentMonthSale = saleMonth === currentMonth;

    // Update sales stats
    setStats((prevStats) => {
      // Update appropriate counters based on timing
      const updatedStats = {
        dailySales: prevStats.dailySales + (isTodaySale ? saleData.total : 0),
        monthlySales:
          prevStats.monthlySales + (isCurrentMonthSale ? saleData.total : 0),
        customerCount: prevStats.customerCount + (isNewMonthlyCustomer ? 1 : 0),
        totalProducts: prevStats.totalProducts,
      };

      // Persist sales stats to localStorage
      localStorage.setItem("sales-stats", JSON.stringify(updatedStats));

      return updatedStats;
    });

    // Add to recent sales
    const newSale = {
      id: recentSales.length + 1,
      orderId: saleData.orderId || `ORD-${Date.now()}`,
      products: saleData.products,
      total: saleData.total,
      date: saleData.timestamp || new Date().toISOString(),
      paymentMethod: saleData.paymentMethod || "Credit Card",
      stockUpdated: true,
      customer: saleData.customer || {
        id: "guest",
        name: "Guest Customer",
      },
    };

    // Add to recent sales list
    const updatedRecentSales = [newSale, ...recentSales];
    setRecentSales(updatedRecentSales);

    // Save to localStorage for persistence
    localStorage.setItem(
      "recent-sales",
      JSON.stringify(updatedRecentSales.slice(0, 50))
    );

    // Update inventory by triggering localStorage update if not already updated
    if (!saleData.inventoryUpdated) {
      saleData.products.forEach((product) => {
        const inventoryUpdate = {
          id: product.id,
          quantity: product.quantity,
        };

        localStorage.setItem(
          "inventoryUpdate",
          JSON.stringify(inventoryUpdate)
        );

        // Trigger storage event for inventory to react
        const storageEvent = new Event("storage");
        storageEvent.key = "inventoryUpdate";
        storageEvent.newValue = JSON.stringify(inventoryUpdate);
        window.dispatchEvent(storageEvent);
      });
    }
  };

  // Simulate a new sale for testing
  const simulateNewSale = () => {
    // Open dialog to enter sale details instead of generating random data
    setSimulateSaleDialogOpen(true);
  };

  // Handle confirming a simulated sale
  const handleConfirmSimulatedSale = (saleData) => {
    // Process the user-entered sale
    processSale(saleData);

    // Close the dialog
    setSimulateSaleDialogOpen(false);

    // Show success message
    setSuccessMessage("Sale processed successfully!");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Simulate Sale Dialog component
  const SimulateSaleDialog = ({
    open,
    onClose,
    onConfirm,
    availableProducts,
  }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [loading, setLoading] = useState(false);

    // Reset form when dialog opens
    useEffect(() => {
      if (open) {
        setSelectedProducts([]);
        setPaymentMethod("Credit Card");
      }
    }, [open]);

    // Add a product to the list
    const addProduct = () => {
      setSelectedProducts([
        ...selectedProducts,
        { id: "", name: "", price: 0, quantity: 1 },
      ]);
    };

    // Remove a product from the list
    const removeProduct = (index) => {
      const newProducts = [...selectedProducts];
      newProducts.splice(index, 1);
      setSelectedProducts(newProducts);
    };

    // Update product selection
    const updateProduct = (index, field, value) => {
      const newProducts = [...selectedProducts];

      // If product is selected, populate with product data
      if (field === "id" && value) {
        const product = availableProducts.find((p) => p.id === value);
        if (product) {
          newProducts[index] = {
            ...newProducts[index],
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: newProducts[index].quantity,
          };
        }
      } else {
        newProducts[index][field] = value;
      }

      setSelectedProducts(newProducts);
    };

    // Calculate total
    const calculateTotal = () => {
      return selectedProducts.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
    };

    // Handle confirmation
    const handleConfirm = () => {
      if (selectedProducts.length === 0) {
        alert("Please add at least one product");
        return;
      }

      if (selectedProducts.some((p) => !p.id)) {
        alert("Please select a product for each item");
        return;
      }

      // Create sale data object
      const saleData = {
        products: selectedProducts,
        total: calculateTotal(),
        paymentMethod,
        timestamp: new Date().toISOString(),
        customer: {
          id: "simulated-" + Date.now(),
          name: "Simulated Customer",
        },
      };

      onConfirm(saleData);

      // Reset form
      setSelectedProducts([]);
      setPaymentMethod("Credit Card");
    };

    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    };

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: "var(--text-primary)" }}>
          Simulate New Sale
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ mt: 1, color: "var(--text-primary)" }}
          >
            Products
          </Typography>

          {selectedProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body2" color="var(--text-secondary)">
                No products added. Click "Add Product" below to add items.
              </Typography>
            </Box>
          ) : (
            <List>
              {selectedProducts.map((product, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  sx={{
                    border: "1px solid",
                    borderColor: "var(--border-color)",
                    mb: 1,
                    borderRadius: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth size="small">
                        <InputLabel id={`product-select-${index}`}>
                          Product
                        </InputLabel>
                        <Select
                          labelId={`product-select-${index}`}
                          value={product.id}
                          onChange={(e) =>
                            updateProduct(index, "id", e.target.value)
                          }
                          label="Product"
                          required
                        >
                          {availableProducts.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.name} ({formatCurrency(p.price)})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        size="small"
                        value={product.quantity}
                        onChange={(e) =>
                          updateProduct(
                            index,
                            "quantity",
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        InputProps={{ inputProps: { min: 1 } }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Price"
                        fullWidth
                        size="small"
                        value={product.price}
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ textAlign: "center" }}>
                      <IconButton
                        color="error"
                        onClick={() => removeProduct(index)}
                        aria-label="remove product"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          )}

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={addProduct}
            sx={{ mb: 3 }}
          >
            Add Product
          </Button>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Debit Card">Debit Card</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderColor: "var(--border-color)",
                }}
              >
                <Typography variant="h6" sx={{ color: "var(--text-primary)" }}>
                  Total: {formatCurrency(calculateTotal())}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={selectedProducts.length === 0}
          >
            Process Sale
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <DarkOverlay>
      <DashboardLayout>
        <Container
          maxWidth="xl"
          sx={{
            mt: 3,
            mb: 4,
            backgroundColor: alpha("#000", 0.7),
            backdropFilter: "blur(8px)",
            borderRadius: 2,
            padding: 3,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            color: "#fff",
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                mb: 1,
              }}
            >
              <MoneyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Sales Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                mb: 2,
              }}
            >
              Manage and track sales performance
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setSimulateSaleDialogOpen(true)}
              startIcon={<CartIcon />}
              sx={{
                boxShadow: "0 4px 12px rgba(0, 151, 230, 0.3)",
                fontWeight: "bold",
                mt: 1,
              }}
            >
              Simulate New Sale
            </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div variants={itemVariants}>
                    <StatsCard
                      title="Today's Sales"
                      value={`₹${stats.dailySales.toLocaleString()}`}
                      icon={<CalendarIcon />}
                      color="#0ea5e9"
                      loading={statsLoading}
                      trend={{
                        value: "+12.5%",
                        label: "vs yesterday",
                        isUpward: true,
                      }}
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <motion.div variants={itemVariants}>
                    <StatsCard
                      title="Monthly Sales"
                      value={`₹${stats.monthlySales.toLocaleString()}`}
                      icon={<MoneyIcon />}
                      color="#10b981"
                      loading={statsLoading}
                      trend={{
                        value: "+8.2%",
                        label: "vs last month",
                        isUpward: true,
                      }}
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <motion.div variants={itemVariants}>
                    <StatsCard
                      title="Products"
                      value={stats.totalProducts.toString()}
                      icon={<InventoryIcon />}
                      color="#f59e0b"
                      loading={statsLoading}
                      trend={{
                        value: "+3",
                        label: "new this week",
                        isUpward: true,
                      }}
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <motion.div variants={itemVariants}>
                    <StatsCard
                      title="Customers"
                      value={stats.customerCount.toString()}
                      icon={<PersonIcon />}
                      color="#ec4899"
                      loading={statsLoading}
                      trend={{
                        value: "+5.8%",
                        label: "new customers",
                        isUpward: true,
                      }}
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: alpha("#000", 0.5),
                        backdropFilter: "blur(5px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 2,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Recent Sales
                      </Typography>

                      {recentSalesLoading ? (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <motion.div
                            animate={{
                              opacity: [0.5, 1, 0.5],
                              transition: { repeat: Infinity, duration: 1.5 },
                            }}
                          >
                            <Typography variant="body1" color="textSecondary">
                              Loading recent sales...
                            </Typography>
                          </motion.div>
                        </Box>
                      ) : recentSales.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 2 }}>
                          <Typography variant="body1" color="textSecondary">
                            No sales records found
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                                >
                                  Date
                                </TableCell>
                                <TableCell
                                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                                >
                                  Products
                                </TableCell>
                                <TableCell
                                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                                >
                                  Customer
                                </TableCell>
                                <TableCell
                                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                                >
                                  Payment
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                                >
                                  Amount
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {recentSales.map((sale, index) => (
                                <TableRow key={index}>
                                  <TableCell sx={{ color: "#fff" }}>
                                    {formatDate(sale.timestamp)}
                                  </TableCell>
                                  <TableCell sx={{ color: "#fff" }}>
                                    {sale.products
                                      .map((p) => `${p.name} (${p.quantity})`)
                                      .join(", ")}
                                  </TableCell>
                                  <TableCell sx={{ color: "#fff" }}>
                                    {sale.customer?.name || "Guest"}
                                  </TableCell>
                                  <TableCell sx={{ color: "#fff" }}>
                                    <Chip
                                      label={
                                        sale.paymentMethod === "credit-card"
                                          ? "Credit Card"
                                          : sale.paymentMethod === "debit-card"
                                          ? "Debit Card"
                                          : sale.paymentMethod === "upi"
                                          ? "UPI"
                                          : "Cash"
                                      }
                                      size="small"
                                      color={
                                        sale.paymentMethod === "cash"
                                          ? "default"
                                          : "primary"
                                      }
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      color: "#0ea5e9",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {formatCurrency(sale.total)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={8}>
                  <motion.div variants={itemVariants}>
                    <SalesChart
                      title="Monthly Sales Trend"
                      subtitle="Revenue over the past year"
                      data={{
                        labels: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        datasets: [
                          {
                            label: "Monthly Sales (₹)",
                            data: [
                              stats.monthlySales * 0.5,
                              stats.monthlySales * 0.6,
                              stats.monthlySales * 0.7,
                              stats.monthlySales * 0.8,
                              stats.monthlySales * 0.9,
                              stats.monthlySales,
                              stats.monthlySales * 1.1,
                              stats.monthlySales * 1.2,
                              stats.monthlySales * 1.3,
                              stats.monthlySales * 1.4,
                              stats.monthlySales * 1.5,
                              stats.monthlySales * 1.6,
                            ],
                          },
                        ],
                      }}
                      className="sales-chart-container"
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={4}>
                  <motion.div variants={itemVariants}>
                    <TopSellingProducts
                      height={380}
                      products={[
                        {
                          name: "Safari Hat",
                          sales: 18,
                          amount: 10782,
                          image: "🧢",
                        },
                        {
                          name: "Binoculars",
                          sales: 12,
                          amount: 23988,
                          image: "🔭",
                        },
                        {
                          name: "Water Bottle",
                          sales: 24,
                          amount: 10800,
                          image: "🧴",
                        },
                        {
                          name: "Trail Mix",
                          sales: 36,
                          amount: 4320,
                          image: "🥜",
                        },
                        {
                          name: "Hiking Boots",
                          sales: 15,
                          amount: 18750,
                          image: "👢",
                        },
                      ]}
                      className="top-products-container"
                    />
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          </Box>

          <SimulateSaleDialog
            open={simulateSaleDialogOpen}
            onClose={() => setSimulateSaleDialogOpen(false)}
            onConfirm={handleConfirmSimulatedSale}
            availableProducts={inventoryContext?.products || []}
          />

          <Snackbar
            open={showSuccess}
            autoHideDuration={6000}
            onClose={() => setShowSuccess(false)}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                backdropFilter: "blur(10px)",
                borderRadius: "12px",
                border: "1px solid var(--success-color)",
              },
            }}
          >
            <Alert
              onClose={() => setShowSuccess(false)}
              severity="success"
              sx={{
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                "& .MuiAlert-icon": {
                  color: "var(--success-color)",
                },
              }}
            >
              {successMessage}
            </Alert>
          </Snackbar>
        </Container>
      </DashboardLayout>
    </DarkOverlay>
  );
};

export default SalesDashboard;
