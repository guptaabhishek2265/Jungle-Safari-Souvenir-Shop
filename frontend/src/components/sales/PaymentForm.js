import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const PaymentForm = ({
  open,
  onClose,
  orderDetails,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    // Load Razorpay script when component mounts
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      setError("Customer name is required");
      return false;
    }
    if (!customerInfo.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      setError("Email is invalid");
      return false;
    }
    if (!customerInfo.phone.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(customerInfo.phone)) {
      setError("Phone number should be 10 digits");
      return false;
    }
    return true;
  };

  const initiateRazorpayPayment = () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    // In a real application, you would make an API call to your backend to create an order
    // Your backend would then create an order with Razorpay and return the order_id
    // For demo purposes, we're simulating this process

    const createRazorpayOrder = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Normally you would get this from your backend
      return {
        id: "order_" + Math.random().toString(36).substr(2, 9),
        amount: orderDetails.totalAmount * 100, // Razorpay expects amount in paise
        currency: "INR",
      };
    };

    createRazorpayOrder()
      .then((orderData) => {
        const options = {
          key: "rzp_test_YOUR_KEY_HERE", // Replace with your Razorpay key
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Jungle Safari Store",
          description: "Purchase from Jungle Safari",
          order_id: orderData.id,
          handler: function (response) {
            // Handle successful payment
            handlePaymentSuccess(response);
          },
          prefill: {
            name: customerInfo.name,
            email: customerInfo.email,
            contact: customerInfo.phone,
          },
          notes: {
            order_items: JSON.stringify(
              orderDetails.items.map((item) => item.name)
            ),
          },
          theme: {
            color: "#2e7d32",
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error creating Razorpay order:", err);
        setError("Failed to initialize payment. Please try again.");
        setLoading(false);
      });
  };

  const handlePaymentSuccess = (paymentResponse) => {
    // Create the complete order object with payment details
    const completedOrder = {
      ...orderDetails,
      customer: customerInfo,
      payment: {
        method: paymentMethod,
        transactionId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id,
        status: "completed",
        timestamp: new Date().toISOString(),
      },
    };

    // Call the callback function with the completed order
    onPaymentSuccess(completedOrder);
  };

  const handleClose = () => {
    setError("");
    setLoading(false);
    onClose();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Complete Your Order</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
            <TextField
              name="name"
              label="Full Name"
              value={customerInfo.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              name="phone"
              label="Phone Number"
              value={customerInfo.phone}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <Paper variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <CreditCardIcon sx={{ mr: 1 }} color="primary" />
                          <Typography>Credit/Debit Card</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                  <Paper variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <FormControlLabel
                      value="upi"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <PaymentsIcon sx={{ mr: 1 }} color="primary" />
                          <Typography>UPI</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                  <Paper variant="outlined" sx={{ mb: 1, p: 1 }}>
                    <FormControlLabel
                      value="netbanking"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <AccountBalanceIcon sx={{ mr: 1 }} color="primary" />
                          <Typography>Net Banking</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              variant="outlined"
              sx={{ p: 2, bgcolor: "#f9f9f9", height: "100%" }}
            >
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {orderDetails.items.map((item) => (
                <Box
                  key={item._id}
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >
                  <Typography variant="body2">
                    {item.name} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  {formatCurrency(orderDetails.subtotal)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Tax (18%)</Typography>
                <Typography variant="body2">
                  {formatCurrency(orderDetails.taxAmount)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formatCurrency(orderDetails.totalAmount)}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Alert severity="info">
            <Typography variant="body2">
              This is a demo payment integration. No actual charges will be
              made. Use test card number 4111 1111 1111 1111, any future
              expiration date, and any random CVV.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={initiateRazorpayPayment}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={24} /> : null}
        >
          {loading ? "Processing..." : "Pay Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentForm;
