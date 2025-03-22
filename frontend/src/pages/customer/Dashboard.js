import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Badge,
  Dialog,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { InventoryContext } from "../inventory/Dashboard";
import { useTheme } from "../../context/ThemeContext"; // Import the global theme hook

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inventoryContext = useContext(InventoryContext);
  const { isDarkTheme, toggleTheme } = useTheme(); // Use the global theme

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderHistoryLoading, setOrderHistoryLoading] = useState(true);
  const [activeView, setActiveView] = useState("shop"); // 'shop' or 'orders'
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  // Set default active view based on URL
  useEffect(() => {
    if (location.pathname.includes("/orders")) {
      setActiveView("orders");
    } else {
      setActiveView("shop");
    }
  }, [location]);

  // Calculate order subtotal, tax, and total
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };

  const [orderTotals, setOrderTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
  });

  // Load products from inventory context if available
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);

      try {
        // Try to get products from inventory context or localStorage
        if (
          inventoryContext &&
          inventoryContext.products &&
          inventoryContext.products.length > 0
        ) {
          setProducts(inventoryContext.products);
        } else {
          // If no context data, try localStorage
          const storedProducts = localStorage.getItem("inventory-products");

          if (storedProducts) {
            // Use products from localStorage
            const parsedProducts = JSON.parse(storedProducts);
            setProducts(parsedProducts);
          } else {
            // If no products in localStorage, initialize with empty array
            setProducts([]);
          }
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      }

      setLoadingProducts(false);
    };

    loadProducts();

    // Listen for inventory updates
    const handleStorageChange = (e) => {
      if (e.key === "inventory-products") {
        const updatedProducts = JSON.parse(e.newValue);
        setProducts(updatedProducts);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [inventoryContext]);

  // Load cart and order history from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("customer-cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("customer-cart", JSON.stringify(cart));
  }, [cart]);

  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("customer-orders", JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Generate an order ID
  const generateOrderId = () => {
    const prefix = "ORD";
    const timestamp = Date.now().toString().slice(-6);
    const orderId = orderHistory.length + 1;
    return `${prefix}-${timestamp}-${orderId.toString().padStart(3, "0")}`;
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

  // Load products and order history on mount
  useEffect(() => {
    // If inventory context has products, use those
    if (
      inventoryContext &&
      inventoryContext.products &&
      inventoryContext.products.length > 0
    ) {
      setProducts(inventoryContext.products);
      setLoadingProducts(false);
    } else {
      // Use mock products from another file if needed
      const loadProducts = async () => {
        setLoadingProducts(true);
        // Simulate API call
        setTimeout(() => {
          // Create mock products if needed
          const mockProducts = [
            // ... existing mock products
          ];
          setProducts(mockProducts);

          // Save to localStorage for other components
          localStorage.setItem(
            "inventoryProducts",
            JSON.stringify(mockProducts)
          );

          setLoadingProducts(false);
        }, 1000);
      };

      if (!products.length) {
        loadProducts();
      }
    }

    // Fetch order history - Add error handling for JSON parsing
    try {
      const storedOrderHistory = localStorage.getItem("customer-orders");
      if (storedOrderHistory) {
        const parsedOrderHistory = JSON.parse(storedOrderHistory);
        if (Array.isArray(parsedOrderHistory)) {
          setOrderHistory(parsedOrderHistory);
        } else {
          console.error("Order history is not an array:", parsedOrderHistory);
          setOrderHistory([]);
          // Reset the corrupted data
          localStorage.setItem("customer-orders", JSON.stringify([]));
        }
      }
    } catch (error) {
      console.error("Error parsing order history:", error);
      setOrderHistory([]);
      // Reset the corrupted data
      localStorage.setItem("customer-orders", JSON.stringify([]));
    }
    setOrderHistoryLoading(false);

    // Listen for inventory updates
    const handleStorageChange = (e) => {
      if (e.key === "inventoryUpdate") {
        const update = JSON.parse(e.newValue);

        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === update.id) {
              return {
                ...product,
                stock: Math.max(0, product.stock - update.quantity),
              };
            }
            return product;
          })
        );
      } else if (e.key === "newProductAdded") {
        const newProduct = JSON.parse(e.newValue);
        setProducts((prevProducts) => [...prevProducts, newProduct]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [inventoryContext, products.length]);

  // Update order totals whenever cart changes
  useEffect(() => {
    const subtotal = calculateSubtotal();
    const taxAmount = calculateTax(subtotal);
    const totalAmount = calculateTotal(subtotal, taxAmount);

    setOrderTotals({
      subtotal,
      taxAmount,
      totalAmount,
    });
  }, [cart]);

  // Add item to cart
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Check if adding one more would exceed the stock
      if (existingItem.quantity + 1 > product.stock) {
        alert(`Sorry, only ${product.stock} items in stock`);
        return;
      }

      // Update quantity if product already in cart
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Add new product to cart
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  // Update cart item quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);

    // Validate against available stock
    if (newQuantity > product.stock) {
      alert(`Sorry, only ${product.stock} items in stock`);
      return;
    }

    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    } else {
      // Update quantity
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Handle checkout button click
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    setCheckoutOpen(true);
  };

  // Close checkout dialog
  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };

  // Process payment and create order
  const handleProcessPayment = async (paymentDetails) => {
    try {
      // Create order details
      const newOrder = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        products: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: orderTotals.subtotal,
        tax: orderTotals.taxAmount,
        total: orderTotals.totalAmount,
        paymentMethod: paymentDetails.method,
        paymentDetails: paymentDetails.details || {},
        status: "completed",
      };

      // Update inventory (decrease stock)
      cart.forEach((item) => {
        // Update local product stock for display
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === item.id) {
              return {
                ...product,
                stock: Math.max(0, product.stock - item.quantity),
              };
            }
            return product;
          })
        );

        // Trigger inventory update for other components
        if (inventoryContext && inventoryContext.updateProductStock) {
          inventoryContext.updateProductStock(item.id, item.quantity);
        } else {
          // If context not available, use localStorage
          const inventoryUpdate = {
            id: item.id,
            quantity: item.quantity,
          };
          localStorage.setItem(
            "inventoryUpdate",
            JSON.stringify(inventoryUpdate)
          );

          // Trigger storage event
          const storageEvent = new Event("storage");
          storageEvent.key = "inventoryUpdate";
          storageEvent.newValue = JSON.stringify(inventoryUpdate);
          window.dispatchEvent(storageEvent);
        }
      });

      // Update sales data
      const saleData = {
        products: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: orderTotals.totalAmount,
        paymentMethod: paymentDetails.method,
        timestamp: new Date().toISOString(),
        customer: {
          id: localStorage.getItem("userId") || Date.now().toString(),
          name: localStorage.getItem("username") || "Customer",
        },
      };

      // Save to localStorage for sales dashboard to pick up
      localStorage.setItem("newSale", JSON.stringify(saleData));

      // Trigger storage event for sales dashboard to update in real-time
      const saleEvent = new Event("storage");
      saleEvent.key = "newSale";
      saleEvent.newValue = JSON.stringify(saleData);
      window.dispatchEvent(saleEvent);

      // Save to customer orders in localStorage with error handling
      try {
        let customerOrders = [];
        const storedOrders = localStorage.getItem("customer-orders");

        if (storedOrders) {
          try {
            const parsedOrders = JSON.parse(storedOrders);
            if (Array.isArray(parsedOrders)) {
              customerOrders = parsedOrders;
            }
          } catch (error) {
            console.error("Error parsing stored orders:", error);
            // If parsing fails, start with empty array
          }
        }

        // Add the new order
        customerOrders.push(newOrder);

        // Save back to localStorage
        localStorage.setItem("customer-orders", JSON.stringify(customerOrders));

        // Update state
        setOrderHistory([newOrder, ...orderHistory]);
      } catch (error) {
        console.error("Error saving order to localStorage:", error);
        alert(
          "There was an issue saving your order history, but your order was processed successfully."
        );
      }

      // Set order details for success dialog
      setOrderDetails(newOrder);

      // Close checkout and show success dialog
      setCheckoutOpen(false);
      setSuccessOpen(true);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  };

  // Handle closing success dialog
  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setOrderDetails(null);
    setCart([]);
  };

  // Render product grid
  const renderProductGrid = () => {
    if (loadingProducts) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress className="custom-spinner" />
        </Box>
      );
    }

    return (
      <Grid container spacing={3} className="grid-background">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card className="product-card">
              <CardMedia
                component="img"
                height="140"
                image={
                  product.imageUrl ||
                  `https://source.unsplash.com/random/300x200?${product.category.toLowerCase()}`
                }
                alt={product.name}
              />
              <CardContent className="card-content">
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  className="card-title text-white"
                >
                  {product.name}
                </Typography>
                <Typography variant="body2" className="text-light" gutterBottom>
                  {product.description || `Quality ${product.category} item`}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" className="card-price">
                    {formatCurrency(product.price)}
                  </Typography>
                  <Chip
                    label={`Stock: ${product.stock}`}
                    size="small"
                    color={
                      product.stock > 5
                        ? "success"
                        : product.stock > 0
                        ? "warning"
                        : "error"
                    }
                    variant="outlined"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  startIcon={<CartIcon />}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="primary-button"
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render shopping cart
  const renderCart = () => {
    return (
      <Paper
        elevation={0}
        variant="outlined"
        className="cart-paper"
        sx={{ p: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <CartIcon sx={{ mr: 1 }} className="tertiary-text" />
          <Typography variant="h6" className="secondary-text">
            Shopping Cart{" "}
            {cart.length > 0 &&
              `(${cart.length} ${cart.length === 1 ? "item" : "items"})`}
          </Typography>
        </Box>
        <div className="custom-divider"></div>

        {cart.length === 0 ? (
          <Box
            className="empty-state-container"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <CartIcon className="empty-state-icon" />
            <Typography
              variant="h6"
              className="text-light"
              align="center"
              gutterBottom
            >
              Your cart is empty
            </Typography>
            <Typography variant="body2" className="text-light" align="center">
              Add products to begin shopping
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ mb: 2 }}>
              {cart.map((item) => (
                <ListItem
                  key={item.id}
                  className="cart-item"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <ListItemText
                        primary={
                          <span className="text-white">{item.name}</span>
                        }
                        secondary={
                          <span className="primary-text">
                            {formatCurrency(item.price)}
                          </span>
                        }
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 1 }} className="text-white">
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        className="tertiary-text"
                        sx={{ ml: 2 }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            <div className="custom-divider"></div>

            <Box sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body1" className="text-white">
                  Subtotal
                </Typography>
                <Typography variant="body1" className="tertiary-text">
                  {formatCurrency(orderTotals.subtotal)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" className="text-light">
                  Tax (18% GST)
                </Typography>
                <Typography variant="body2" className="text-light">
                  {formatCurrency(orderTotals.taxAmount)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h6" className="text-white">
                  Total
                </Typography>
                <Typography variant="h6" className="primary-text">
                  {formatCurrency(orderTotals.totalAmount)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleCheckout}
                startIcon={<PaymentIcon />}
                className="primary-button"
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Paper>
    );
  };

  // Render order history
  const renderOrderHistory = () => {
    if (orderHistoryLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="400px"
        >
          <CircularProgress className="custom-spinner" />
        </Box>
      );
    }

    if (orderHistory.length === 0) {
      return (
        <Box
          className="empty-state-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <ReceiptIcon className="empty-state-icon" />
          <Typography
            variant="h6"
            className="text-light"
            align="center"
            gutterBottom
          >
            No order history
          </Typography>
          <Typography variant="body2" className="text-light" align="center">
            Your purchases will appear here
          </Typography>
        </Box>
      );
    }

    return (
      <Box className="grid-background">
        <Typography variant="h5" gutterBottom className="secondary-text">
          Order History
        </Typography>

        {orderHistory.map((order) => (
          <Paper
            key={order.id}
            elevation={0}
            variant="outlined"
            className="order-paper"
            sx={{ p: 2, mb: 2 }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                variant="subtitle1"
                className="primary-text"
                fontWeight="bold"
              >
                {order.id}
              </Typography>
              <Chip
                icon={<CheckCircleIcon />}
                label={order.status}
                color="success"
                size="small"
              />
            </Box>

            <Typography variant="body2" className="text-light" gutterBottom>
              {formatDate(order.date)}
            </Typography>

            <div className="custom-divider"></div>

            <List dense>
              {order.products.map((item, index) => (
                <ListItem key={index} sx={{ py: 0 }}>
                  <ListItemText
                    primary={
                      <span className="text-white">{`${item.name} x ${item.quantity}`}</span>
                    }
                    secondary={
                      <span className="text-light">
                        {formatCurrency(item.price)}
                      </span>
                    }
                  />
                  <Typography className="tertiary-text">
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <div className="custom-divider"></div>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="body2" className="text-light">
                  Subtotal: {formatCurrency(order.subtotal)}
                </Typography>
                <Typography variant="body2" className="text-light">
                  Tax: {formatCurrency(order.tax)}
                </Typography>
              </Box>
              <Typography variant="h6" className="primary-text">
                Total: {formatCurrency(order.total)}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  // Main component render
  return (
    <Container
      maxWidth="xl"
      className="customer-dashboard-container sales-dashboard-container"
      sx={{ mt: 3, mb: 4 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" gutterBottom className="primary-text">
          <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Customer Dashboard
        </Typography>

        <Box display="flex" alignItems="center">
          <Button
            variant={activeView === "shop" ? "contained" : "outlined"}
            color="primary"
            startIcon={<StoreIcon />}
            onClick={() => {
              setActiveView("shop");
              navigate("/customer");
            }}
            sx={{ mr: 1 }}
            className={activeView === "shop" ? "primary-button" : ""}
          >
            Shop
          </Button>
          <Button
            variant={activeView === "orders" ? "contained" : "outlined"}
            color="primary"
            startIcon={<ReceiptIcon />}
            onClick={() => {
              setActiveView("orders");
              navigate("/customer/orders");
            }}
            className={activeView === "orders" ? "secondary-button" : ""}
          >
            My Orders
          </Button>
        </Box>
      </Box>

      <div className="custom-divider"></div>

      {activeView === "shop" ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {renderProductGrid()}
          </Grid>
          <Grid item xs={12} md={4}>
            {renderCart()}
          </Grid>
        </Grid>
      ) : (
        renderOrderHistory()
      )}

      {/* Payment Form Dialog */}
      <Dialog
        open={checkoutOpen}
        onClose={handleCloseCheckout}
        maxWidth="sm"
        fullWidth
        PaperProps={{ className: "custom-dialog-paper" }}
      >
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Complete Your Purchase
          </Typography>

          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              Order Summary
            </Typography>
            <List dense>
              {cart.map((item) => (
                <ListItem key={item.id}>
                  <ListItemText
                    primary={`${item.name} x ${item.quantity}`}
                    secondary={formatCurrency(item.price)}
                  />
                  <Typography>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Box>
                <Typography variant="body2">
                  Subtotal: {formatCurrency(orderTotals.subtotal)}
                </Typography>
                <Typography variant="body2">
                  Tax (18% GST): {formatCurrency(orderTotals.taxAmount)}
                </Typography>
              </Box>
              <Typography variant="h6" color="primary">
                Total: {formatCurrency(orderTotals.totalAmount)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom>
            Payment Method
          </Typography>

          {/* Payment Method Selection */}
          <Box mb={3}>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                defaultValue="credit-card"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="credit-card"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <CreditCardIcon sx={{ mr: 1 }} /> Credit Card
                    </Box>
                  }
                />
                <FormControlLabel
                  value="debit-card"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <CreditCardIcon sx={{ mr: 1 }} /> Debit Card
                    </Box>
                  }
                />
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <PaymentIcon sx={{ mr: 1 }} /> Cash on Delivery
                    </Box>
                  }
                />
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <AccountBalanceIcon sx={{ mr: 1 }} /> UPI
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Dynamic Payment Details Form */}
          {paymentMethod === "credit-card" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  required
                  inputProps={{ maxLength: 19 }}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value.replace(/\D/g, "");
                    const formattedValue = value.replace(
                      /(\d{4})(?=\d)/g,
                      "$1 "
                    );
                    e.target.value = formattedValue;
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date"
                  fullWidth
                  placeholder="MM/YY"
                  required
                  inputProps={{ maxLength: 5 }}
                  onChange={(e) => {
                    // Format date as MM/YY
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length > 2) {
                      e.target.value = `${value.slice(0, 2)}/${value.slice(2)}`;
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  placeholder="123"
                  required
                  type="password"
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cardholder Name"
                  fullWidth
                  placeholder="John Doe"
                  required
                />
              </Grid>
            </Grid>
          )}

          {paymentMethod === "debit-card" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  fullWidth
                  placeholder="1234 5678 9012 3456"
                  required
                  inputProps={{ maxLength: 19 }}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value.replace(/\D/g, "");
                    const formattedValue = value.replace(
                      /(\d{4})(?=\d)/g,
                      "$1 "
                    );
                    e.target.value = formattedValue;
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expiry Date"
                  fullWidth
                  placeholder="MM/YY"
                  required
                  inputProps={{ maxLength: 5 }}
                  onChange={(e) => {
                    // Format date as MM/YY
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length > 2) {
                      e.target.value = `${value.slice(0, 2)}/${value.slice(2)}`;
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  placeholder="123"
                  required
                  type="password"
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cardholder Name"
                  fullWidth
                  placeholder="John Doe"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bank Name"
                  fullWidth
                  placeholder="Your Bank"
                  required
                />
              </Grid>
            </Grid>
          )}

          {paymentMethod === "upi" && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="UPI ID"
                  fullWidth
                  placeholder="username@upi"
                  required
                  helperText="Example: yourname@okaxis or yourname@ybl"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  You will receive a payment request on your UPI app. Please
                  keep your UPI app ready.
                </Alert>
              </Grid>
            </Grid>
          )}

          {paymentMethod === "cash" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Pay with cash when your order is delivered. Please keep exact
              change ready.
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseCheckout}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PaymentIcon />}
            onClick={() => {
              // Get all payment form details
              let details = {};

              if (
                paymentMethod === "credit-card" ||
                paymentMethod === "debit-card"
              ) {
                const cardNumber = document.querySelector(
                  'input[placeholder="1234 5678 9012 3456"]'
                )?.value;
                const expiry = document.querySelector(
                  'input[placeholder="MM/YY"]'
                )?.value;
                const cardholderName = document.querySelector(
                  'input[placeholder="John Doe"]'
                )?.value;

                if (!cardNumber || !expiry || !cardholderName) {
                  alert("Please fill all card details");
                  return;
                }

                details = { cardType: paymentMethod, cardholderName };
              } else if (paymentMethod === "upi") {
                const upiId = document.querySelector(
                  'input[placeholder="username@upi"]'
                )?.value;

                if (!upiId) {
                  alert("Please enter a valid UPI ID");
                  return;
                }

                details = { upiId };
              }

              handleProcessPayment({
                method: paymentMethod,
                details: details,
              });
            }}
          >
            Pay {formatCurrency(orderTotals.totalAmount)}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Success Dialog */}
      <Dialog
        open={successOpen}
        onClose={handleCloseSuccess}
        PaperProps={{ className: "custom-dialog-paper" }}
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" p={2}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Your order #{orderDetails?.id} has been placed successfully.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              A confirmation has been sent to your email.
            </Typography>

            <Box my={2} width="100%">
              <Alert severity="success">
                <Box display="flex" alignItems="center">
                  <Typography variant="body2">
                    Inventory has been updated successfully! Your order is being
                    processed.
                  </Typography>
                </Box>
              </Alert>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              handleCloseSuccess();
              setActiveView("orders");
              navigate("/customer/orders");
            }}
          >
            View Orders
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseSuccess}
          >
            Continue Shopping
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerDashboard;
