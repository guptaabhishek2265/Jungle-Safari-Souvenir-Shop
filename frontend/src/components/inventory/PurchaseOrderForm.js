import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  Box,
  IconButton,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const PurchaseOrderForm = ({
  open,
  onClose,
  onSave,
  suppliers = [],
  products = [],
  purchaseOrder = null,
  isEditing = false,
  loadingSuppliers = false,
  loadingProducts = false,
}) => {
  const initialFormState = {
    supplier: "",
    expectedDeliveryDate: "",
    status: "pending",
    notes: "",
    items: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Product selection state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Initialize form data when editing an existing purchase order
  useEffect(() => {
    if (purchaseOrder && isEditing) {
      setFormData({
        supplier: purchaseOrder.supplier || "",
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate
          ? new Date(purchaseOrder.expectedDeliveryDate)
              .toISOString()
              .split("T")[0]
          : "",
        status: purchaseOrder.status || "pending",
        notes: purchaseOrder.notes || "",
        items: purchaseOrder.items || [],
      });
    } else {
      setFormData(initialFormState);
    }
  }, [purchaseOrder, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is modified
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleProductSelect = (event, newValue) => {
    setSelectedProduct(newValue);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQuantity(value > 0 ? value : 1);
  };

  const addProductToOrder = () => {
    if (!selectedProduct) return;

    // Check if product already exists in the order
    const existingItemIndex = formData.items.findIndex(
      (item) => item.product._id === selectedProduct._id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already in order
      const updatedItems = [...formData.items];
      updatedItems[existingItemIndex].quantity += quantity;

      setFormData({
        ...formData,
        items: updatedItems,
      });
    } else {
      // Add new product to order
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            product: selectedProduct,
            quantity,
            price: selectedProduct.cost, // Use cost price for PO
          },
        ],
      });
    }

    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);

    // Clear items error if it exists
    if (errors.items) {
      setErrors({
        ...errors,
        items: null,
      });
    }
  };

  const removeProductFromOrder = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const calculateTotal = () => {
    return formData.items
      .reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0)
      .toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier) {
      newErrors.supplier = "Supplier is required";
    }

    if (!formData.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = "Expected delivery date is required";
    }

    if (formData.items.length === 0) {
      newErrors.items = "At least one product is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Find supplier object to get the name
    const selectedSupplier = suppliers.find((s) => s._id === formData.supplier);

    // Format data for submission
    const formattedData = {
      ...formData,
      // Add supplier name
      supplierName: selectedSupplier
        ? selectedSupplier.name
        : "Unknown Supplier",
      // Convert items to the format expected by the API
      items: formData.items.map((item) => ({
        product: item.product._id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    onSave(formattedData);
  };

  // Find supplier name by ID
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s._id === supplierId);
    return supplier ? supplier.name : "";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Purchase Order" : "Create New Purchase Order"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Supplier */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal" error={!!errors.supplier}>
              <InputLabel>Supplier *</InputLabel>
              <Select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                disabled={isEditing || loadingSuppliers}
                label="Supplier *"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.supplier && (
                <Typography variant="caption" color="error">
                  {errors.supplier}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Expected Delivery Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Expected Delivery Date"
              name="expectedDeliveryDate"
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={!!errors.expectedDeliveryDate}
              helperText={errors.expectedDeliveryDate}
              required
            />
          </Grid>

          {/* Status (only for editing) */}
          {isEditing && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>

          {/* Product Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Add Products to Order
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) =>
                      `${option.name} (SKU: ${option.sku})`
                    }
                    value={selectedProduct}
                    onChange={handleProductSelect}
                    disabled={loadingProducts}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Product" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addProductToOrder}
                    disabled={!selectedProduct}
                    startIcon={<AddIcon />}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {errors.items && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mb: 2, display: "block" }}
              >
                {errors.items}
              </Typography>
            )}

            {/* Order Items Table */}
            {formData.items.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
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
                    {formData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>{item.product.sku}</TableCell>
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
                            onClick={() => removeProductFromOrder(index)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} align="right">
                        <Typography variant="subtitle1">Total:</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">
                          ${calculateTotal()}
                        </Typography>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                No products added to the order yet.
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={formData.items.length === 0}
        >
          {isEditing ? "Update Order" : "Create Order"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseOrderForm;
