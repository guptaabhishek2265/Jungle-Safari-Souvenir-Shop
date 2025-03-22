import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";

const CreatePurchaseOrder = ({
  isOpen,
  onClose,
  onSave,
  suppliers = [],
  products = [],
  loadingSuppliers,
  loadingProducts,
}) => {
  const [purchaseOrder, setPurchaseOrder] = useState({
    supplier: null,
    orderDate: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 7 days from now
    items: [],
    notes: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});

  // Calculate total
  const calculateTotal = () => {
    return purchaseOrder.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  };

  const handleSupplierChange = (event, newValue) => {
    setPurchaseOrder({ ...purchaseOrder, supplier: newValue });
    setValidationErrors((prev) => ({ ...prev, supplier: null }));
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setPurchaseOrder({ ...purchaseOrder, [name]: value });
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
  };

  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value) || 1);
  };

  const handleAddItem = () => {
    if (!selectedProduct) return;

    // Check if product already exists in the order
    const existingItemIndex = purchaseOrder.items.findIndex(
      (item) => item.id === selectedProduct.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      const updatedItems = [...purchaseOrder.items];
      updatedItems[existingItemIndex].quantity += quantity;
      setPurchaseOrder({ ...purchaseOrder, items: updatedItems });
    } else {
      // Add new item to the order
      const newItem = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        sku: selectedProduct.sku,
        price: selectedProduct.cost || selectedProduct.price, // Use cost price if available
        quantity: quantity,
      };
      setPurchaseOrder({
        ...purchaseOrder,
        items: [...purchaseOrder.items, newItem],
      });
    }

    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);
    setValidationErrors((prev) => ({ ...prev, items: null }));
  };

  const handleRemoveItem = (itemId) => {
    setPurchaseOrder({
      ...purchaseOrder,
      items: purchaseOrder.items.filter((item) => item.id !== itemId),
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPurchaseOrder({ ...purchaseOrder, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!purchaseOrder.supplier) {
      errors.supplier = "Supplier is required";
    }

    if (!purchaseOrder.orderDate) {
      errors.orderDate = "Order date is required";
    }

    if (!purchaseOrder.expectedDeliveryDate) {
      errors.expectedDeliveryDate = "Expected delivery date is required";
    }

    if (purchaseOrder.items.length === 0) {
      errors.items = "At least one item is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const orderData = {
      ...purchaseOrder,
      total: calculateTotal(),
      orderNumber: `PO-${Date.now().toString().slice(-6)}`,
      status: "Pending",
    };

    onSave(orderData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Create Purchase Order</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Supplier Selection */}
          <Grid item xs={12} md={8}>
            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) => option.name}
              value={purchaseOrder.supplier}
              onChange={handleSupplierChange}
              loading={loadingSuppliers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Supplier"
                  variant="outlined"
                  error={!!validationErrors.supplier}
                  helperText={validationErrors.supplier}
                  required
                />
              )}
            />
          </Grid>

          {/* Order Date */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Order Date"
              type="date"
              name="orderDate"
              value={purchaseOrder.orderDate}
              onChange={handleDateChange}
              variant="outlined"
              fullWidth
              required
              error={!!validationErrors.orderDate}
              helperText={validationErrors.orderDate}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Expected Delivery Date */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Expected Delivery Date"
              type="date"
              name="expectedDeliveryDate"
              value={purchaseOrder.expectedDeliveryDate}
              onChange={handleDateChange}
              variant="outlined"
              fullWidth
              required
              error={!!validationErrors.expectedDeliveryDate}
              helperText={validationErrors.expectedDeliveryDate}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} md={8}>
            <TextField
              label="Notes"
              name="notes"
              multiline
              rows={1}
              value={purchaseOrder.notes}
              onChange={handleInputChange}
              variant="outlined"
              fullWidth
            />
          </Grid>

          {/* Product Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Add Products
            </Typography>

            <Box display="flex" alignItems="flex-start" gap={2}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => `${option.name} (${option.sku})`}
                value={selectedProduct}
                onChange={handleProductChange}
                loading={loadingProducts}
                sx={{ flexGrow: 1 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Product"
                    variant="outlined"
                  />
                )}
              />

              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                variant="outlined"
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ width: 100 }}
              />

              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={!selectedProduct}
              >
                Add
              </Button>
            </Box>

            {validationErrors.items && (
              <Typography color="error" variant="caption">
                {validationErrors.items}
              </Typography>
            )}
          </Grid>

          {/* Items Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrder.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography variant="body2" sx={{ py: 2 }}>
                          No products added yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchaseOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell align="right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {/* Total Row */}
                  {purchaseOrder.items.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="subtitle1">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold">
                          ${calculateTotal().toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePurchaseOrder;
