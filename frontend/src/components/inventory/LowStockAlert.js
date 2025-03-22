import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import axios from "axios";

const LowStockAlert = ({ products, loading, onCreatePurchaseOrder }) => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [error, setError] = useState(null);
  const [autoReorderDialog, setAutoReorderDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [autoReorderSuccess, setAutoReorderSuccess] = useState(false);

  // Fetch low stock products
  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        const API_URL = "http://localhost:5000/api";
        const response = await axios.get(
          `${API_URL}/purchase-orders/low-stock/products`
        );
        setLowStockProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching low stock products:", err);
        setError("Failed to load low stock alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  // Handle opening the auto-reorder dialog
  const handleOpenAutoReorder = () => {
    // By default, select all products for reordering
    setSelectedProducts([...lowStockProducts]);
    setAutoReorderDialog(true);
  };

  // Toggle product selection for reordering
  const toggleProductSelection = (product) => {
    const currentIndex = selectedProducts.findIndex(
      (p) => p._id === product._id
    );
    const newSelectedProducts = [...selectedProducts];

    if (currentIndex === -1) {
      // Add to selection
      newSelectedProducts.push(product);
    } else {
      // Remove from selection
      newSelectedProducts.splice(currentIndex, 1);
    }

    setSelectedProducts(newSelectedProducts);
  };

  // Check if a product is selected
  const isProductSelected = (productId) => {
    return selectedProducts.some((p) => p._id === productId);
  };

  // Create purchase orders automatically from low stock items
  const handleAutoReorder = async () => {
    if (selectedProducts.length === 0) {
      setAutoReorderDialog(false);
      return;
    }

    setProcessingOrder(true);

    // Group products by supplier
    const productsBySupplier = selectedProducts.reduce((acc, product) => {
      const { supplier } = product;

      if (!acc[supplier]) {
        acc[supplier] = [];
      }

      acc[supplier].push(product);
      return acc;
    }, {});

    try {
      // Create a purchase order for each supplier
      for (const supplierId in productsBySupplier) {
        const products = productsBySupplier[supplierId];

        // Calculate reorder quantities - for each product, order enough to get back above reorder level
        const items = products.map((product) => {
          const reorderQuantity = Math.max(
            product.reorderLevel - product.stock + 5,
            3
          );
          return {
            product: product._id,
            quantity: reorderQuantity,
            price: product.cost || 9.99, // Default cost if not available
          };
        });

        // Set delivery date to 7 days from now
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        // Create purchase order data
        const purchaseOrderData = {
          supplier: supplierId,
          expectedDeliveryDate: deliveryDate.toISOString(),
          items,
          notes: "Auto-generated purchase order for low stock items",
        };

        // In a real app, you would call the API to create the purchase order here
        // For demo purposes, simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Call the parent component's handler to create the purchase order
        if (onCreatePurchaseOrder) {
          onCreatePurchaseOrder(purchaseOrderData);
        }
      }

      setAutoReorderSuccess(true);

      // Reset after showing success message
      setTimeout(() => {
        setAutoReorderSuccess(false);
        setAutoReorderDialog(false);
        setProcessingOrder(false);
      }, 2000);
    } catch (err) {
      console.error("Error creating auto-reorder purchase orders:", err);
      setProcessingOrder(false);
    }
  };

  // Get stock status color based on levels
  const getStockStatusColor = (stock, reorderLevel) => {
    if (stock === 0) return "error";
    if (stock <= reorderLevel / 2) return "error";
    if (stock <= reorderLevel) return "warning";
    return "success";
  };

  // Get stock status text
  const getStockStatusText = (stock, reorderLevel) => {
    if (stock === 0) return "Out of Stock";
    if (stock <= reorderLevel / 2) return "Critical";
    if (stock <= reorderLevel) return "Low";
    return "OK";
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render skeleton loading state
  const renderSkeletonItems = () => {
    return Array(3)
      .fill()
      .map((_, index) => (
        <React.Fragment key={`skeleton-${index}`}>
          <ListItem>
            <Box width="100%">
              <Skeleton animation="wave" height={28} width="60%" />
              <Skeleton animation="wave" height={20} width="40%" />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Skeleton animation="wave" height={24} width="30%" />
                <Skeleton animation="wave" height={24} width="20%" />
              </Box>
            </Box>
          </ListItem>
          <Divider />
        </React.Fragment>
      ));
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="center" p={3}>
          <CircularProgress size={24} sx={{ mr: 2 }} />
          <Typography>Loading stock alerts...</Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <Box
        sx={{
          p: 2,
          bgcolor: "warning.light",
          borderBottom: "1px solid",
          borderColor: "warning.main",
          display: "flex",
          alignItems: "center",
        }}
      >
        <WarningIcon color="warning" sx={{ mr: 1 }} />
        <Typography variant="h6" color="warning.dark">
          Low Stock Items
        </Typography>
      </Box>

      {loading ? (
        <List sx={{ py: 0 }}>{renderSkeletonItems()}</List>
      ) : products.length === 0 ? (
        <Box p={3} textAlign="center">
          <Alert severity="success" sx={{ mt: 1 }}>
            No low stock items at the moment!
          </Alert>
        </Box>
      ) : (
        <>
          <List sx={{ py: 0 }}>
            {products.map((product, index) => (
              <React.Fragment key={product.id}>
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <Typography variant="subtitle1">
                          {product.name}
                        </Typography>
                        <Chip
                          label={`${product.stock} left`}
                          color="error"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {product.sku} • Category: {product.category}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mt={1}
                        >
                          <Typography variant="body2">
                            Price: {formatCurrency(product.price)}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            Reorder Level: {product.reorderLevel}
                          </Typography>
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < products.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box p={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={onCreatePurchaseOrder}
            >
              Create Purchase Order
            </Button>
          </Box>
        </>
      )}

      {/* Auto-Reorder Dialog */}
      <Dialog
        open={autoReorderDialog}
        onClose={() => setAutoReorderDialog(false)}
      >
        <DialogTitle>Auto-Reorder Low Stock Products</DialogTitle>
        <DialogContent>
          {autoReorderSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Auto-reorder purchase orders created successfully!
            </Alert>
          ) : (
            <>
              <Typography gutterBottom>
                Select products to include in automatic purchase orders. Orders
                will be grouped by supplier.
              </Typography>
              <List>
                {lowStockProducts.map((product) => (
                  <ListItem
                    key={product._id}
                    onClick={() => toggleProductSelection(product)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isProductSelected(product._id)
                        ? "rgba(0, 0, 0, 0.04)"
                        : "transparent",
                    }}
                  >
                    <ListItemText
                      primary={product.name}
                      secondary={`Current Stock: ${product.stock} / Reorder Level: ${product.reorderLevel}`}
                    />
                    <Chip
                      label={
                        isProductSelected(product._id) ? "Selected" : "Excluded"
                      }
                      color={
                        isProductSelected(product._id) ? "primary" : "default"
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </DialogContent>

        <DialogActions>
          {!autoReorderSuccess && (
            <>
              <Button onClick={() => setAutoReorderDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAutoReorder}
                color="primary"
                variant="contained"
                disabled={selectedProducts.length === 0 || processingOrder}
                startIcon={
                  processingOrder ? (
                    <CircularProgress size={18} />
                  ) : (
                    <AutorenewIcon />
                  )
                }
              >
                {processingOrder ? "Processing..." : "Create Purchase Orders"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LowStockAlert;
