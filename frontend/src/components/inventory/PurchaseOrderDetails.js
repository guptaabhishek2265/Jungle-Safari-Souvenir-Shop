import React from "react";
import {
  Paper,
  Box,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import {
  LocalShipping as ShippingIcon,
  Business as BusinessIcon,
  DateRange as DateIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";

const PurchaseOrderDetails = ({ order, open, onClose, onUpdateStatus }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircleIcon fontSize="small" />;
      case "cancelled":
        return <CancelIcon fontSize="small" />;
      case "pending":
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      case "pending":
      default:
        return "warning";
    }
  };

  const calculateTotal = () => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <ReceiptIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Purchase Order: {order.orderNumber}
            </Typography>
          </Box>
          <Chip
            icon={getStatusIcon(order.status)}
            label={order.status || "Pending"}
            color={getStatusColor(order.status)}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Order Info & Supplier Info */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle1" gutterBottom>
                Order Information
              </Typography>

              <Box display="flex" alignItems="center" mb={1}>
                <DateIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Order Date:</strong> {formatDate(order.orderDate)}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <ShippingIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Expected Delivery:</strong>{" "}
                  {formatDate(order.expectedDeliveryDate)}
                </Typography>
              </Box>

              {order.deliveryDate && (
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon
                    fontSize="small"
                    color="success"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2">
                    <strong>Delivered On:</strong>{" "}
                    {formatDate(order.deliveryDate)}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Typography variant="subtitle1" gutterBottom>
                Supplier Information
              </Typography>

              {order.supplier ? (
                <>
                  <Box display="flex" alignItems="center" mb={1}>
                    <BusinessIcon
                      fontSize="small"
                      color="action"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2">
                      <strong>Name:</strong> {order.supplier.name}
                    </Typography>
                  </Box>

                  <Box display="flex" mb={1}>
                    <Typography variant="body2" sx={{ ml: 3 }}>
                      <strong>Contact:</strong>{" "}
                      {order.supplier.contactName || "N/A"}
                      {order.supplier.phone && ` | ${order.supplier.phone}`}
                    </Typography>
                  </Box>

                  <Box display="flex" mb={1}>
                    <Typography variant="body2" sx={{ ml: 3 }}>
                      <strong>Email:</strong> {order.supplier.email || "N/A"}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Supplier information not available
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Order Items
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell align="right">
                          ${item.price?.toFixed(2) || "0.00"}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          $
                          {((item.price || 0) * (item.quantity || 0)).toFixed(
                            2
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body2" sx={{ py: 2 }}>
                          No items in this order
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Total Row */}
                  {order.items && order.items.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="subtitle1">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          $
                          {order.total?.toFixed(2) ||
                            calculateTotal().toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Notes */}
          {order.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Notes
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2">{order.notes}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            px: 2,
            py: 1,
          }}
        >
          <div>
            {order.status?.toLowerCase() === "pending" && (
              <>
                <Button
                  color="success"
                  onClick={() => onUpdateStatus(order.id, "Delivered")}
                  sx={{ mr: 1 }}
                >
                  Mark as Delivered
                </Button>
                <Button
                  color="error"
                  onClick={() => onUpdateStatus(order.id, "Cancelled")}
                >
                  Cancel Order
                </Button>
              </>
            )}
          </div>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderDetails;
