import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const Settings = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
      setFormData({
        ...formData,
        name: userData.name || '',
        email: userData.email || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClickShowPassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({
        open: true,
        message: 'New passwords do not match!',
        severity: 'error',
      });
      return;
    }
    
    // In a real app, you would send this data to an API
    // For now, we'll just update localStorage
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setAlert({
      open: true,
      message: 'Profile updated successfully!',
      severity: 'success',
    });
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'primary.main',
            fontSize: '2rem',
            mr: 2
          }}
        >
          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        
        <Box>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body1" color="text.secondary">
            {user.role === 'admin' && 'Administrator'}
            {user.role === 'inventory_manager' && 'Inventory Manager'}
            {user.role === 'sales' && 'Sales Representative'}
            {user.role === 'customer' && 'Customer'}
          </Typography>
        </Box>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Change Password
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="current-password">Current Password</InputLabel>
                <OutlinedInput
                  id="current-password"
                  name="currentPassword"
                  type={showPassword.currentPassword ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword('currentPassword')}
                        edge="end"
                      >
                        {showPassword.currentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Current Password"
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}></Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="new-password">New Password</InputLabel>
                <OutlinedInput
                  id="new-password"
                  name="newPassword"
                  type={showPassword.newPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword('newPassword')}
                        edge="end"
                      >
                        {showPassword.newPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="New Password"
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
                <OutlinedInput
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword('confirmPassword')}
                        edge="end"
                      >
                        {showPassword.confirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Confirm New Password"
                />
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                sx={{ mr: 1 }}
              >
                Save Changes
              </Button>
              <Button variant="outlined">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings; 