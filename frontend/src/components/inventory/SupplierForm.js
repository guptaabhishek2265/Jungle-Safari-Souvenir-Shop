import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Chip,
  Box,
  Typography,
} from "@mui/material";

const PRODUCT_CATEGORIES = [
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

const SupplierForm = ({
  open,
  onClose,
  onSave,
  supplier = null,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    categories: [],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Initialize form data when editing an existing supplier
  useEffect(() => {
    if (supplier && isEditing) {
      setFormData({
        name: supplier.name || "",
        contactPerson: supplier.contactPerson || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        categories: supplier.categories || [],
        notes: supplier.notes || "",
      });
    }
  }, [supplier, isEditing]);

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

  const handleCategoriesChange = (event, newValue) => {
    setFormData({
      ...formData,
      categories: newValue,
    });
    if (errors.categories) {
      setErrors({
        ...errors,
        categories: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (formData.categories.length === 0) {
      newErrors.categories = "At least one category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Supplier" : "Add New Supplier"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Supplier Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Supplier Name"
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

          {/* Contact Person */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>

          {/* Categories */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={PRODUCT_CATEGORIES}
              value={formData.categories}
              onChange={handleCategoriesChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplied Categories"
                  margin="normal"
                  error={!!errors.categories}
                  helperText={errors.categories}
                  required
                />
              )}
            />
            <Typography variant="caption" color="text.secondary">
              Select the product categories supplied by this vendor
            </Typography>
          </Grid>

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
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEditing ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierForm;
