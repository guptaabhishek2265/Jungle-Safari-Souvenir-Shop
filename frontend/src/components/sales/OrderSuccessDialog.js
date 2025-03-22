import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Chip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ReceiptLong as ReceiptIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

const OrderSuccessDialog = ({
  open,
  onClose,
  onFinish,
  order,
  inventoryUpdated,
}) => {
  if (!order) return null;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="order-success-dialog-title"
    >
      <DialogTitle id="order-success-dialog-title" sx={{ pb: 0 }}>
        <Box display="flex" alignItems="center">
          <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6">Order Completed Successfully</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ pb: 2 }}>
          The order has been processed and the following items have been sold.
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Order ID</Typography>
            <Typography variant="body1">{order.orderId}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Date & Time</Typography>
            <Typography variant="body1">{formatDate(order.date)}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          <ReceiptIcon
            fontSize="small"
            sx={{ mr: 1, verticalAlign: "text-bottom" }}
          />
          Order Items
        </Typography>

        <List disablePadding sx={{ mb: 2 }}>
          {order.items.map((item, index) => (
            <ListItem
              key={item._id || index}
              disablePadding
              sx={{ py: 0.5, px: 0 }}
            >
              <ListItemText
                primary={
                  <Grid container alignItems="center">
                    <Grid item xs={7}>
                      <Typography variant="body2">
                        {item.name} × {item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ textAlign: "right" }}>
                      <Typography variant="body2">
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </Grid>
                  </Grid>
                }
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mb: 2 }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">Subtotal</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography variant="body2">
                {formatCurrency(order.subtotal)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2">Tax (18% GST)</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography variant="body2">
                {formatCurrency(order.tax)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle2">Total</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "right" }}>
              <Typography variant="subtitle2">
                {formatCurrency(order.total)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <InventoryIcon
              fontSize="small"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            <Typography variant="subtitle2">Inventory Status:</Typography>
          </Box>
          {inventoryUpdated ? (
            <Chip
              label="Stock Updated"
              color="success"
              size="small"
              icon={<CheckCircleIcon />}
            />
          ) : (
            <Chip label="Update Pending" color="warning" size="small" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {inventoryUpdated
            ? "Product stock levels have been automatically reduced."
            : "Product stock levels will be updated soon."}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button
          onClick={onFinish}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
        >
          New Sale
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderSuccessDialog;
