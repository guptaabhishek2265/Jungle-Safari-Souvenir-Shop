import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material";

const ShoppingCart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onApplyDiscount,
  discountCode,
  setDiscountCode,
  discount,
  tax,
  total,
}) => {
  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.stock) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <CartIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Shopping Cart</Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Box
          sx={{
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <CartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.3 }} />
          <Typography variant="h6">Your cart is empty</Typography>
          <Typography variant="body2">
            Search or scan products to add them to your cart
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        SKU: {item.sku}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(item.price)}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{ mx: 1, minWidth: "25px", textAlign: "center" }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(item.price * item.quantity)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                size="small"
                label="Discount Code"
                variant="outlined"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <Button
                variant="outlined"
                onClick={onApplyDiscount}
                disabled={!discountCode}
              >
                Apply
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatPrice(subtotal)}</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Tax ({tax}%):</Typography>
              <Typography>{formatPrice(subtotal * (tax / 100))}</Typography>
            </Box>

            {discount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="error">Discount:</Typography>
                <Typography color="error">-{formatPrice(discount)}</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatPrice(total)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={onCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ShoppingCart;
