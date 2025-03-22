import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  QrCodeScanner as ScannerIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

const ProductSearch = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample products data - in a real app, this would come from an API
  const products = [
    {
      id: 1,
      name: "Safari Hat",
      price: 24.99,
      sku: "SH001",
      stock: 45,
      image: null,
    },
    {
      id: 2,
      name: "Binoculars",
      price: 89.99,
      sku: "BN002",
      stock: 12,
      image: null,
    },
    {
      id: 3,
      name: "Water Bottle",
      price: 14.99,
      sku: "WB003",
      stock: 78,
      image: null,
    },
    {
      id: 4,
      name: "Hiking Boots",
      price: 129.99,
      sku: "HB004",
      stock: 23,
      image: null,
    },
    {
      id: 5,
      name: "Insect Repellent",
      price: 9.99,
      sku: "IR005",
      stock: 56,
      image: null,
    },
    {
      id: 6,
      name: "Compass",
      price: 19.99,
      sku: "CP006",
      stock: 34,
      image: null,
    },
    {
      id: 7,
      name: "First Aid Kit",
      price: 29.99,
      sku: "FA007",
      stock: 18,
      image: null,
    },
    {
      id: 8,
      name: "Camping Tent",
      price: 199.99,
      sku: "CT008",
      stock: 7,
      image: null,
    },
  ];

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Simulate API search loading
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value.toLowerCase()) ||
          product.sku.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
      setLoading(false);
    }, 300);
  };

  const handleScanBarcode = () => {
    // In a real app, this would integrate with a barcode scanner
    alert("Barcode scanner would be activated here");
    // For demo, we'll simulate scanning a product
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    onProductSelect(randomProduct);
  };

  const handleProductSelect = (product) => {
    onProductSelect(product);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <Paper sx={{ width: "100%", p: 2, mb: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products by name or scan barcode..."
        value={searchTerm}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleScanBarcode}
                edge="end"
                aria-label="scan barcode"
              >
                <ScannerIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {searchResults.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            maxHeight: 300,
            overflow: "auto",
            position: "absolute",
            width: "calc(100% - 32px)",
            zIndex: 9999,
          }}
        >
          <List>
            {searchResults.map((product, index) => (
              <React.Fragment key={product.id}>
                <ListItem
                  button
                  onClick={() => handleProductSelect(product)}
                  alignItems="flex-start"
                >
                  <ListItemAvatar>
                    <Avatar>
                      <InventoryIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {product.name}
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          {formatPrice(product.price)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          SKU: {product.sku}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            product.stock > 10 ? "success.main" : "error.main"
                          }
                        >
                          In Stock: {product.stock}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < searchResults.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Paper>
  );
};

export default ProductSearch;
