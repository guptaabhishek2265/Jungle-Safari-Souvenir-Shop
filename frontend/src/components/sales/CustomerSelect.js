import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

const CustomerSelect = ({ selectedCustomer, onSelectCustomer }) => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Sample customer data - in a real app, this would come from an API
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "123-456-7890",
      loyaltyPoints: 240,
      address: "123 Safari St, Jungle City",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "234-567-8901",
      loyaltyPoints: 120,
      address: "456 Wild Ave, Forest Hills",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "345-678-9012",
      loyaltyPoints: 450,
      address: "789 Trek Rd, Adventure Valley",
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "456-789-0123",
      loyaltyPoints: 85,
      address: "101 Expedition Ln, Safari Heights",
    },
  ]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    // Validate required fields
    if (!newCustomer.name || !newCustomer.phone) {
      alert("Name and phone are required fields");
      return;
    }

    // In a real app, this would be an API call
    const newCustomerId = customers.length + 1;
    const customerToAdd = {
      id: newCustomerId,
      ...newCustomer,
      loyaltyPoints: 0,
    };

    setCustomers([...customers, customerToAdd]);
    onSelectCustomer(customerToAdd);
    handleCloseDialog();
  };

  const handleRemoveCustomer = () => {
    onSelectCustomer(null);
  };

  return (
    <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <PersonIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Customer</Typography>
      </Box>

      {selectedCustomer ? (
        <Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Box display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {selectedCustomer.name}
                </Typography>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <PhoneIcon
                    fontSize="small"
                    sx={{ mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {selectedCustomer.phone}
                  </Typography>
                </Box>
                {selectedCustomer.email && (
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <EmailIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {selectedCustomer.email}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Chip
              label={`${selectedCustomer.loyaltyPoints} points`}
              color="primary"
              variant="outlined"
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleRemoveCustomer}
            sx={{ mt: 1 }}
          >
            Remove
          </Button>
        </Box>
      ) : (
        <Box>
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <li {...props}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      fontSize: "0.75rem",
                      mr: 1,
                      bgcolor: "primary.main",
                    }}
                  >
                    {option.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({option.phone})
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search customer"
                variant="outlined"
                fullWidth
                size="small"
              />
            )}
            onChange={(_, newValue) => {
              if (newValue) {
                onSelectCustomer(newValue);
              }
            }}
          />
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Can't find the customer?
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              size="small"
            >
              Add New Customer
            </Button>
          </Box>

          {/* New Customer Dialog */}
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    required
                    value={newCustomer.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="phone"
                    label="Phone Number"
                    fullWidth
                    required
                    value={newCustomer.phone}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    fullWidth
                    value={newCustomer.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    multiline
                    rows={2}
                    value={newCustomer.address}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleAddCustomer}
                variant="contained"
                color="primary"
              >
                Add Customer
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Paper>
  );
};

export default CustomerSelect;
