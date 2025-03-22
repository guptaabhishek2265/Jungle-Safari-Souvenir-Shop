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
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const StockTable = ({ products, loading, onEdit, onAdd }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get unique categories from products
  const categories = products
    ? ["all", ...new Set(products.map((product) => product.category))]
    : ["all"];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  const filteredProducts = products
    ? products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
    : [];

  const getStockStatusColor = (quantity, reorderLevel) => {
    if (quantity <= 0) return "error";
    if (quantity <= reorderLevel) return "warning";
    return "success";
  };

  const getStockStatusText = (quantity, reorderLevel) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= reorderLevel) return "Low Stock";
    return "In Stock";
  };

  // Render skeleton loading state
  const renderSkeletonRows = () => {
    return Array(5)
      .fill()
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {Array(6)
            .fill()
            .map((_, cellIndex) => (
              <TableCell key={`cell-${index}-${cellIndex}`}>
                <Skeleton animation="wave" height={24} />
              </TableCell>
            ))}
        </TableRow>
      ));
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          sx={{ width: "300px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell>
                <Typography variant="subtitle2">Product Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">SKU</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Category</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Price</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Stock</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Status</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2">{product.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.sku}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={
                          product.stock <= product.reorderLevel
                            ? "error.main"
                            : "inherit"
                        }
                        fontWeight={
                          product.stock <= product.reorderLevel
                            ? "bold"
                            : "normal"
                        }
                      >
                        {product.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStockStatusText(
                          product.stock,
                          product.reorderLevel
                        )}
                        size="small"
                        color={getStockStatusColor(
                          product.stock,
                          product.reorderLevel
                        )}
                        sx={{ minWidth: "90px" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default StockTable;
