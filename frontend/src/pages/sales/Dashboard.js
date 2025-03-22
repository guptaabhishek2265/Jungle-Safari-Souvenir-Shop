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
    <DashboardLayout
      title="Safari Sales Overview"
      className="sales-dashboard-container"
    >
      {/* Safari Stats Cards */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          className="safari-neon-text"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: '"🌴"',
              marginRight: "10px",
              fontSize: "24px",
            },
          }}
        >
          Safari Statistics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Today's Sales"
              value={formatCurrency(stats.dailySales)}
              icon={<MoneyIcon />}
              color="#2e7d32"
              loading={statsLoading}
              className="stats-card"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Monthly Sales"
              value={formatCurrency(stats.monthlySales)}
              icon={<CalendarIcon />}
              color="#1976d2"
              loading={statsLoading}
              className="stats-card"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<InventoryIcon />}
              color="#9c27b0"
              loading={statsLoading}
              className="stats-card"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              title="Customers"
              value={stats.customerCount}
              icon={<PersonIcon />}
              color="#ed6c02"
              loading={statsLoading}
              className="stats-card"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          className="safari-neon-text"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: '"🧭"',
              marginRight: "10px",
              fontSize: "24px",
            },
          }}
        >
          Quick Actions
        </Typography>
        <Paper
          elevation={0}
          className="safari-neon-border"
          sx={{
            p: 3,
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            background: "rgba(15, 34, 23, 0.3)",
            backdropFilter: "blur(5px)",
            border: "1px solid var(--border-color)",
            "&::after": {
              content: '"🦏"',
              position: "absolute",
              bottom: "10px",
              right: "15px",
              fontSize: "40px",
              opacity: 0.1,
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: "20px",
                      background:
                        "linear-gradient(145deg, var(--card-background), rgba(17, 34, 64, 0.7))",
                      boxShadow: "0 10px 20px var(--shadow-color)",
                      overflow: "hidden",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "150px",
                        height: "150px",
                        background:
                          "radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)",
                        bottom: "-40px",
                        left: "-40px",
                        borderRadius: "50%",
                        zIndex: 0,
                      },
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow:
                          "0 15px 30px var(--shadow-color), 0 0 15px var(--glow-color)",
                      },
                    }}
                    className="stats-card"
                  >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                          pb: 1.5,
                          borderBottom: "1px solid var(--border-color)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Box
                          component={motion.div}
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 4,
                            repeatDelay: 2,
                          }}
                          sx={{
                            background:
                              "linear-gradient(135deg, var(--success-color) 0%, #059669 100%)",
                            color: "white",
                            p: 1,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CartIcon fontSize="small" />
                        </Box>
                        Test Real-time Sales Tracking
                      </Typography>
                      <Typography
                        variant="body2"
                        color="var(--text-secondary)"
                        paragraph
                        sx={{ mb: 3, lineHeight: 1.6 }}
                      >
                        Simulate a new sale to test real-time updates across the
                        system. This will increase sales figures and decrease
                        inventory.
                      </Typography>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          startIcon={<CartIcon />}
                          onClick={simulateNewSale}
                          sx={{
                            borderRadius: "12px",
                            px: 3,
                            py: 1.2,
                            background:
                              "linear-gradient(to right, var(--success-color), #059669)",
                            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              boxShadow: "0 6px 15px rgba(16, 185, 129, 0.4)",
                              background:
                                "linear-gradient(to right, var(--success-color), #059669)",
                            },
                          }}
                        >
                          Simulate New Sale
                        </Button>
                      </motion.div>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "& .MuiAlert-icon": {
              color: "var(--primary-light)",
            },
            "& .MuiAlert-message": {
              fontWeight: 500,
              color: "var(--text-primary)",
            },
            backgroundColor: "rgba(74, 108, 255, 0.1)",
          }}
        >
          Inventory is automatically updated in real-time for all sales. Product
          stock levels decrease and sales data increases when transactions are
          completed.
        </Alert>
      </motion.div>

      {/* Recent Sales Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          className="safari-neon-text"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: '"🧾"',
              marginRight: "10px",
              fontSize: "24px",
            },
          }}
        >
          Recent Safari Orders
        </Typography>

        <Paper
          sx={{
            p: 3,
            borderRadius: "20px",
            background:
              "linear-gradient(145deg, var(--card-background), rgba(26, 56, 41, 0.7))",
            boxShadow: "0 10px 20px var(--shadow-color)",
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              width: "100%",
              height: "100%",
              background: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0a9 9 0 0 0-9 9v30a9 9 0 0 0 9 9h30a9 9 0 0 0 9-9V9a9 9 0 0 0-9-9H9zm0 2h30a7 7 0 0 1 7 7v30a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7zm13 12a2 2 0 1 0-4 0v14a2 2 0 1 0 4 0v-3.513l12.84 8.139a2 2 0 1 0 2.16-3.372L24.157 21l12.836-8.243a2 2 0 1 0-2.155-3.374L22 17.513V14z' fill='%232e7d32' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: "120px 120px",
              zIndex: 0,
              opacity: 0.5,
            },
            "&::after": {
              content: '"🦁"',
              position: "absolute",
              fontSize: "40px",
              opacity: 0.1,
              bottom: "20px",
              right: "20px",
              zIndex: 0,
            },
          }}
          className="top-products-container"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 5 }}
              >
                <MoneyIcon sx={{ mr: 1.5, color: "var(--secondary-color)" }} />
              </motion.div>
              Recent Safari Sales
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  textTransform: "none",
                  fontWeight: 600,
                  borderWidth: "2px",
                }}
              >
                View All
              </Button>
            </motion.div>
          </Box>

          {recentSalesLoading ? (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Loading recent sales...
              </Typography>
            </Box>
          ) : recentSales.length > 0 ? (
            <TableContainer
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              sx={{
                position: "relative",
                zIndex: 1,
                "& .MuiTableCell-root": {
                  borderColor: "var(--border-color)",
                  padding: "16px 12px",
                },
                "& .MuiTableRow-root:hover": {
                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                },
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Order ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Products
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Total
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Payment Method
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentSales.map((sale, index) => (
                    <motion.tr
                      key={sale.id}
                      component={motion.tr}
                      variants={itemVariants}
                      style={{
                        background:
                          index % 2 === 0
                            ? "rgba(46, 125, 50, 0.05)"
                            : "transparent",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell sx={{ color: "var(--text-primary)" }}>
                        {sale.id}
                      </TableCell>
                      <TableCell sx={{ color: "var(--text-primary)" }}>
                        {sale.products.length > 1
                          ? `${sale.products[0].name} +${
                              sale.products.length - 1
                            } more`
                          : sale.products[0].name}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontWeight: 600, color: "var(--primary-light)" }}
                      >
                        {formatCurrency(sale.total)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={sale.paymentMethod}
                          size="small"
                          sx={{
                            background: "rgba(46, 125, 50, 0.15)",
                            color: "var(--text-primary)",
                            fontWeight: 500,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "var(--text-secondary)",
                          fontSize: "0.8rem",
                        }}
                      >
                        {formatDate(sale.date)}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={sale.stockUpdated ? "Completed" : "Pending"}
                          size="small"
                          color={sale.stockUpdated ? "success" : "warning"}
                          sx={{
                            fontWeight: 500,
                            borderRadius: "6px",
                            minWidth: "80px",
                          }}
                        />
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                py: 4,
                textAlign: "center",
                background: "rgba(46, 125, 50, 0.03)",
                borderRadius: "12px",
                p: 3,
                border: "1px dashed var(--border-color)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Typography variant="body1" color="var(--text-primary)">
                No recent safari sales found
              </Typography>
              <Typography
                variant="body2"
                color="var(--text-secondary)"
                sx={{ mt: 1 }}
              >
                Simulated sales will appear here
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Recent Sales & Chart Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          className="safari-neon-text"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: '"📊"',
              marginRight: "10px",
              fontSize: "24px",
            },
          }}
        >
          Sales Analytics
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <SalesChart
              height={380}
              data={{
                week: {
                  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                  data: [
                    stats.dailySales * 0.5,
                    stats.dailySales * 0.7,
                    stats.dailySales * 0.4,
                    stats.dailySales * 0.8,
                    stats.dailySales,
                    stats.dailySales * 0.6,
                    stats.dailySales * 0.9,
                  ],
                },
                month: {
                  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                  data: [
                    stats.monthlySales * 0.2,
                    stats.monthlySales * 0.3,
                    stats.monthlySales * 0.2,
                    stats.monthlySales * 0.3,
                  ],
                },
                year: {
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
              }}
              className="sales-chart-container"
            />
          </Grid>

          <Grid item xs={12} md={4}>
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
          </Grid>
        </Grid>
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
    </DashboardLayout>
  );
};

export default SalesDashboard;
