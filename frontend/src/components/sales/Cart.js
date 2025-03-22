import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  TextField,
  Grid,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const TAX_RATE = 0.18; // 18% GST

const Cart = ({ cartItems, updateQuantity, removeItem, onCheckout }) => {
  // Calculate subtotal of all items
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate tax amount
  const taxAmount = subtotal * TAX_RATE;

  // Calculate total amount including tax
  const totalAmount = subtotal + taxAmount;

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  if (cartItems.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Your Cart
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <Typography variant="body1" color="text.secondary">
            Your cart is empty. Add some items to get started.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Cart
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <List disablePadding>
        {cartItems.map((item) => (
          <ListItem key={item._id} sx={{ py: 1, px: 0 }}>
            <ListItemText
              primary={item.name}
              secondary={`SKU: ${item.sku} • ${formatCurrency(
                item.price
              )} each`}
              sx={{ mr: 2 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <IconButton
                size="small"
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <TextField
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 1;
                  updateQuantity(item._id, value);
                }}
                inputProps={{ min: 1, style: { textAlign: "center" } }}
                sx={{ width: "50px", mx: 1 }}
                size="small"
              />
              <IconButton
                size="small"
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography
              variant="body2"
              sx={{ minWidth: 80, textAlign: "right" }}
            >
              {formatCurrency(item.price * item.quantity)}
            </Typography>
            <IconButton
              edge="end"
              color="error"
              onClick={() => removeItem(item._id)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">
                {formatCurrency(subtotal)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="body2"
                color="text.secondary"
                display="flex"
                alignItems="center"
              >
                Tax (18% GST) <Chip size="small" label="18%" sx={{ ml: 1 }} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(taxAmount)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Card variant="outlined" sx={{ mb: 3, bgcolor: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cartItems.length} items in cart
            </Typography>
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2">Total amount:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          onClick={() => onCheckout(subtotal, taxAmount, totalAmount)}
        >
          Proceed to Checkout
        </Button>
      </List>
    </Paper>
  );
};

export default Cart;
