import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

const ProductsTable = ({
  products = [],
  loading = false,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  categories = [],
}) => {
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle category filter
  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  // Filter functions
  const openFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const clearFilters = () => {
    setCategoryFilter("");
    closeFilterMenu();
  };

  // Delete product functions
  const openDeleteDialog = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setProductToDelete(null);
    setDeleteDialogOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete._id);
      closeDeleteDialog();
    }
  };

  // Apply filters to products list
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode &&
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === "" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Low stock indicator
  const getStockStatusColor = (stock, reorderLevel) => {
    if (stock <= 0) return "error";
    if (stock <= reorderLevel) return "warning";
    return "success";
  };

  return (
    <>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="h2">
          Products
          {filteredProducts.length > 0 && (
            <Typography
              component="span"
              variant="body2"
              sx={{ ml: 1, color: "text.secondary" }}
            >
              ({filteredProducts.length})
            </Typography>
          )}
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddProduct}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Search by name, SKU or barcode..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            flexGrow: 1,
            minWidth: "250px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "var(--border-color)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-color)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary-color)",
              },
              backgroundColor: "var(--input-bg)",
            },
            "& .MuiInputBase-input": {
              color: "var(--text-primary)",
            },
            "& .MuiInputAdornment-root .MuiSvgIcon-root": {
              color: "var(--text-secondary)",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl
          sx={{
            minWidth: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "var(--border-color)",
              },
              "&:hover fieldset": {
                borderColor: "var(--primary-color)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary-color)",
              },
              backgroundColor: "var(--input-bg)",
            },
            "& .MuiSelect-select": {
              color: "var(--text-primary)",
            },
            "& .MuiFormLabel-root": {
              color: "var(--text-secondary)",
              "&.Mui-focused": {
                color: "var(--primary-color)",
              },
            },
            "& .MuiSvgIcon-root": {
              color: "var(--text-secondary)",
            },
          }}
          size="small"
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            label="Category"
            displayEmpty
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {categoryFilter && (
          <Button
            size="small"
            onClick={clearFilters}
            sx={{
              color: "var(--primary-color)",
              "&:hover": {
                backgroundColor: "rgba(74, 108, 255, 0.08)",
              },
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>

      {/* Products Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "var(--card-shadow)",
          overflow: "hidden",
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--card-bg)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography>Loading products...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography>
                    {searchTerm || categoryFilter
                      ? "No products match the current filters"
                      : "No products available"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          product.stock <= 0
                            ? "Out of Stock"
                            : product.stock <= product.reorderLevel
                            ? "Low Stock"
                            : "In Stock"
                        }
                        color={getStockStatusColor(
                          product.stock,
                          product.reorderLevel
                        )}
                        size="small"
                        sx={{
                          "&.MuiChip-colorSuccess": {
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            color: "var(--success-color)",
                          },
                          "&.MuiChip-colorError": {
                            backgroundColor: "rgba(239, 68, 68, 0.15)",
                            color: "var(--error-color)",
                          },
                          "&.MuiChip-colorWarning": {
                            backgroundColor: "rgba(245, 158, 11, 0.15)",
                            color: "var(--warning-color)",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditProduct(product)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{productToDelete?.name}
            "? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductsTable;
