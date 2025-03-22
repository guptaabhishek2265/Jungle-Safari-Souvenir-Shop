import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  MonetizationOn as CashIcon,
  AccountBalance as BankIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

// Note: In a real app, you would import Razorpay or Stripe SDK here
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('your_stripe_public_key');

const PaymentDialog = ({
  open,
  onClose,
  total,
  cartItems,
  customer,
  onPaymentComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, error
  const [paymentTab, setPaymentTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [cashAmount, setCashAmount] = useState("");
  const [cashChange, setCashChange] = useState(0);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handlePaymentTabChange = (event, newValue) => {
    setPaymentTab(newValue);
  };

  const handleCashAmountChange = (event) => {
    const amount = event.target.value;
    setCashAmount(amount);

    if (amount && !isNaN(amount) && parseFloat(amount) >= total) {
      setCashChange(parseFloat(amount) - total);
    } else {
      setCashChange(0);
    }
  };

  const processCashPayment = () => {
    if (!cashAmount || isNaN(cashAmount) || parseFloat(cashAmount) < total) {
      alert("Please enter a valid cash amount that covers the total");
      return;
    }

    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success");
      setActiveStep(2);
    }, 1500);
  };

  const processCardPayment = () => {
    setPaymentStatus("processing");

    // In a real app, you would integrate with Stripe or Razorpay here
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success");
      setActiveStep(2);
    }, 2000);
  };

  const handleInitiatePayment = () => {
    setActiveStep(1);

    if (paymentMethod === "cash") {
      processCashPayment();
    } else if (paymentMethod === "card") {
      processCardPayment();
    } else {
      // Bank transfer or other methods
      setPaymentStatus("processing");
      setTimeout(() => {
        setPaymentStatus("success");
        setActiveStep(2);
      }, 1500);
    }
  };

  const handleCompleteTransaction = () => {
    // In a real app, you would save the transaction in the database here
    onPaymentComplete({
      orderId: `ORD-${Date.now()}`,
      paymentMethod,
      amount: total,
      customer,
      items: cartItems,
      date: new Date(),
    });
    onClose();
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <Box sx={{ p: 2 }}>
            <Tabs
              value={paymentTab}
              onChange={handlePaymentTabChange}
              centered
              sx={{ mb: 2 }}
            >
              <Tab icon={<CreditCardIcon />} label="Credit Card" />
              <Tab icon={<PaymentIcon />} label="Razorpay" />
            </Tabs>

            {paymentTab === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Expiry Date"
                    placeholder="MM/YY"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="CVC"
                    placeholder="123"
                    fullWidth
                    type="password"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Cardholder Name"
                    placeholder="John Smith"
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {paymentTab === 1 && (
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="body1" gutterBottom>
                  Click the button below to pay using Razorpay
                </Typography>
                <Box
                  component="img"
                  src="https://razorpay.com/assets/razorpay-logo.svg"
                  alt="Razorpay"
                  sx={{ height: 40, my: 2 }}
                />
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                  gutterBottom
                >
                  You will be redirected to Razorpay's secure payment page
                </Typography>
              </Box>
            )}
          </Box>
        );

      case "cash":
        return (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Cash Amount Received"
                  fullWidth
                  variant="outlined"
                  InputProps={{ startAdornment: "$" }}
                  value={cashAmount}
                  onChange={handleCashAmountChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Change Due
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatPrice(cashChange)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );

      case "bank":
        return (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body1" gutterBottom>
              Please transfer the total amount to our bank account:
            </Typography>
            <Paper
              variant="outlined"
              sx={{ p: 2, my: 2, mx: "auto", maxWidth: 400 }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Account Details
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={1}>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    Bank Name:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2">Safari National Bank</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    Account Number:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2">1234567890</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    Routing Number:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2">987654321</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body2" color="text.secondary">
                    Reference:
                  </Typography>
                </Grid>
                <Grid item xs={6} textAlign="left">
                  <Typography variant="body2">
                    POS-{Date.now().toString().substring(8)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case "processing":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
            }}
          >
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">Processing Payment</Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we process your payment...
            </Typography>
          </Box>
        );

      case "success":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
            }}
          >
            <Box
              sx={{
                bgcolor: "success.main",
                color: "white",
                borderRadius: "50%",
                p: 2,
                mb: 3,
              }}
            >
              <CheckIcon fontSize="large" />
            </Box>
            <Typography variant="h6" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              Thank you for your purchase.
            </Typography>
            {customer && (
              <Chip
                label={`${customer.name} earned ${Math.floor(
                  total
                )} loyalty points`}
                color="primary"
                sx={{ mt: 2 }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4 }}
              onClick={handleCompleteTransaction}
            >
              Complete Transaction
            </Button>
          </Box>
        );

      case "error":
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 4,
            }}
          >
            <Box
              sx={{
                bgcolor: "error.main",
                color: "white",
                borderRadius: "50%",
                p: 2,
                mb: 3,
              }}
            >
              <PaymentIcon fontSize="large" />
            </Box>
            <Typography variant="h6" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body1" align="center" gutterBottom>
              There was an error processing your payment. Please try again.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 4 }}
              onClick={() => {
                setPaymentStatus("pending");
                setActiveStep(0);
              }}
            >
              Try Again
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <PaymentIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Complete Payment</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Select Payment Method</StepLabel>
          </Step>
          <Step>
            <StepLabel>Process Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirmation</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 && (
          <>
            <Typography variant="h5" gutterBottom align="center">
              Total: {formatPrice(total)}
            </Typography>

            <Box sx={{ my: 3 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="payment-method"
                  name="payment-method"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <Paper variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
                    <FormControlLabel
                      value="card"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <CreditCardIcon color="primary" sx={{ mr: 1 }} />
                          <Typography>Credit/Debit Card or Razorpay</Typography>
                        </Box>
                      }
                      sx={{ p: 1, width: "100%" }}
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ mb: 2, borderRadius: 1 }}>
                    <FormControlLabel
                      value="cash"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <CashIcon color="primary" sx={{ mr: 1 }} />
                          <Typography>Cash</Typography>
                        </Box>
                      }
                      sx={{ p: 1, width: "100%" }}
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ borderRadius: 1 }}>
                    <FormControlLabel
                      value="bank"
                      control={<Radio />}
                      label={
                        <Box display="flex" alignItems="center">
                          <BankIcon color="primary" sx={{ mr: 1 }} />
                          <Typography>Bank Transfer</Typography>
                        </Box>
                      }
                      sx={{ p: 1, width: "100%" }}
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            {renderPaymentForm()}
          </>
        )}

        {activeStep > 0 && renderPaymentStatus()}
      </DialogContent>

      {activeStep === 0 && (
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleInitiatePayment}
          >
            Process Payment
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default PaymentDialog;
