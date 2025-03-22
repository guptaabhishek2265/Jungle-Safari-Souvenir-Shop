import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Autocomplete,
  Box,
  Typography,
  FormHelperText,
} from "@mui/material";

const CATEGORIES = [
  "Apparel",
  "Bastar Art",
  "Bottles",
  "Souvenirs",
  "Books",
  "Equipment",
  "Footwear",
  "Health",
  "Food",
  "Maps",
  "Accessories",
];

const ProductForm = ({
  open,
  onClose,
  onSave,
  product = null,
  suppliers = [],
  loadingSuppliers,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
    reorderLevel: "",
    barcode: "",
    sku: "",
    supplier: null,
    description: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when editing an existing product
  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        cost: product.cost || "",
        stock: product.stock || "",
        reorderLevel: product.reorderLevel || "",
        barcode: product.barcode || "",
        sku: product.sku || "",
        supplier: product.supplier || null,
        description: product.description || "",
        imageUrl: product.imageUrl || "",
      });
    }
  }, [product, isEditing]);

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

  const handleSupplierChange = (event, newValue) => {
    setFormData({
      ...formData,
      supplier: newValue,
    });
    if (errors.supplier) {
      setErrors({
        ...errors,
        supplier: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Initial stock is required";
    } else if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative number";
    }

    if (!formData.reorderLevel) {
      newErrors.reorderLevel = "Reorder level is required";
    } else if (
      isNaN(formData.reorderLevel) ||
      Number(formData.reorderLevel) <= 0
    ) {
      newErrors.reorderLevel = "Reorder level must be a positive number";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Format number fields
    const formattedData = {
      ...formData,
      price: Number(formData.price),
      cost: formData.cost ? Number(formData.cost) : undefined,
      stock: Number(formData.stock),
      reorderLevel: Number(formData.reorderLevel),
    };

    onSave(formattedData);
  };

  // Generate a random SKU if creating a new product and no SKU is set
  const generateSKU = () => {
    if (isEditing || formData.sku) return;

    const prefix = formData.category
      ? formData.category.substring(0, 3).toUpperCase()
      : "PRD";

    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    setFormData({
      ...formData,
      sku: `${prefix}-${randomNum}`,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Product" : "Add New Product"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Product Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.category}
              required
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Price"
              name="price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.price}
              helperText={errors.price}
              required
            />
          </Grid>

          {/* Cost */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Cost Price"
              name="cost"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              value={formData.cost}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          {/* Initial Stock */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Initial Stock"
              name="stock"
              type="number"
              inputProps={{ min: 0 }}
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.stock}
              helperText={errors.stock}
              required
              disabled={isEditing} // Don't allow stock editing directly
            />
          </Grid>

          {/* Reorder Level */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Reorder Level"
              name="reorderLevel"
              type="number"
              inputProps={{ min: 1 }}
              value={formData.reorderLevel}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.reorderLevel}
              helperText={errors.reorderLevel}
              required
            />
          </Grid>

          {/* Barcode */}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          {/* SKU */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <TextField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.sku}
                helperText={errors.sku}
                required
                disabled={isEditing} // Don't allow SKU editing
              />
              {!isEditing && (
                <Button
                  onClick={generateSKU}
                  sx={{ mt: 3, ml: 1 }}
                  variant="outlined"
                  size="small"
                >
                  Generate
                </Button>
              )}
            </Box>
          </Grid>

          {/* Supplier */}
          <Grid item xs={12}>
            <Autocomplete
              options={suppliers}
              getOptionLabel={(option) => option.name}
              value={formData.supplier}
              onChange={handleSupplierChange}
              loading={loadingSuppliers}
              sx={{ mt: 2 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  variant="outlined"
                  error={!!errors.supplier}
                  helperText={errors.supplier}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>

          {/* Image URL */}
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              fullWidth
              margin="normal"
              placeholder="https://example.com/image.jpg"
              helperText="Enter a URL for the product image (optional)"
            />
            {formData.imageUrl && (
              <Box mt={2} display="flex" justifyContent="center">
                <Box
                  component="img"
                  src={formData.imageUrl}
                  alt="Product preview"
                  sx={{
                    maxHeight: 150,
                    maxWidth: "100%",
                    objectFit: "contain",
                    border: "1px solid #ddd",
                    borderRadius: 1,
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/150?text=Invalid+Image+URL";
                  }}
                />
              </Box>
            )}
          </Grid>

          {isEditing && (
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                Note: To adjust stock levels, please use the inventory
                adjustment function.
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
