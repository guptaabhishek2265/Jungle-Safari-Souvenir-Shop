import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Chip,
  TablePagination,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  LocalShipping as SupplierIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";

const PurchaseOrderManagement = ({ products = [] }) => {
  // Mock purchase orders data
  const mockPurchaseOrders = [
    {
      id: "PO10001",
      date: "2023-11-15",
      supplier: "Tribal Art Collective",
      status: "Pending",
      totalAmount: 15750,
      items: [
        {
          productId: 1,
          name: "Bastar Art Products Item 5",
          quantity: 15,
          price: 550,
          total: 8250,
        },
        {
          productId: 7,
          name: "Handicrafts Item 12",
          quantity: 10,
          price: 750,
          total: 7500,
        },
      ],
    },
    {
      id: "PO10002",
      date: "2023-11-18",
      supplier: "Chhattisgarh Textiles Ltd",
      status: "Approved",
      totalAmount: 22500,
      items: [
        {
          productId: 2,
          name: "Shirts Item 8",
          quantity: 25,
          price: 450,
          total: 11250,
        },
        {
          productId: 15,
          name: "Canvas Bags Item 21",
          quantity: 15,
          price: 750,
          total: 11250,
        },
      ],
    },
    {
      id: "PO10003",
      date: "2023-11-20",
      supplier: "Premium Stationery Suppliers",
      status: "Delivered",
      totalAmount: 8500,
      items: [
        {
          productId: 22,
          name: "Stationery Item 27",
          quantity: 50,
          price: 170,
          total: 8500,
        },
      ],
    },
    {
      id: "PO10004",
      date: "2023-11-22",
      supplier: "Dhokra Art Association",
      status: "Cancelled",
      totalAmount: 32000,
      items: [
        {
          productId: 18,
          name: "Tribal Art Item 25",
          quantity: 16,
          price: 2000,
          total: 32000,
        },
      ],
    },
    {
      id: "PO10005",
      date: "2023-11-25",
      supplier: "Eco-Friendly Packaging",
      status: "Pending",
      totalAmount: 9450,
      items: [
        {
          productId: 31,
          name: "Bottles Item 36",
          quantity: 30,
          price: 315,
          total: 9450,
        },
      ],
    },
  ];

  // Mock suppliers data
  const mockSuppliers = [
    { id: 1, name: "Tribal Art Collective" },
    { id: 2, name: "Chhattisgarh Textiles Ltd" },
    { id: 3, name: "Eco-Friendly Packaging" },
    { id: 4, name: "Premium Stationery Suppliers" },
    { id: 5, name: "Dhokra Art Association" },
  ];

  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // New purchase order state
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    items: [{ productId: "", name: "", quantity: 1, price: 0, total: 0 }],
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  });

  // Load data on mount
  useEffect(() => {
    const loadPurchaseOrders = () => {
      setLoading(true);
      // Load from localStorage
      const savedOrders = localStorage.getItem("purchase-orders");

      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          setPurchaseOrders(parsedOrders);
          setFilteredOrders(parsedOrders);
        } catch (err) {
          console.error("Error parsing purchase orders:", err);
          setPurchaseOrders([]);
          setFilteredOrders([]);
        }
      } else {
        // If no saved orders, initialize with mock data
        setPurchaseOrders(mockPurchaseOrders);
        setFilteredOrders(mockPurchaseOrders);
      }

      setLoading(false);
    };

    loadPurchaseOrders();

    // Listen for storage events (auto-generated orders)
    const handleStorageChange = (e) => {
      if (e.key === "purchase-orders") {
        try {
          const updatedOrders = JSON.parse(e.newValue);
          setPurchaseOrders(updatedOrders);

          // Apply current filters to the updated orders
          if (search) {
            handleSearchChange({ target: { value: search } });
          } else if (statusFilter !== "all") {
            handleStatusFilterChange({ target: { value: statusFilter } });
          } else {
            setFilteredOrders(updatedOrders);
          }
        } catch (err) {
          console.error("Error handling storage event:", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Filter orders when search or status filter changes
  useEffect(() => {
    if (!purchaseOrders.length) {
      setFilteredOrders([]);
      return;
    }

    const lowercasedSearch = search.toLowerCase();
    let filtered = purchaseOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(lowercasedSearch) ||
        order.supplier.toLowerCase().includes(lowercasedSearch)
    );

    // Apply status filter if not "All"
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [purchaseOrders, search, statusFilter]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  // View purchase order details
  const handleViewOrder = (order) => {
    setCurrentOrder(order);
    setViewDialogOpen(true);
  };

  // Close view dialog
  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setCurrentOrder(null);
  };

  // Open create purchase order dialog
  const handleCreateOrder = () => {
    setCreateDialogOpen(true);
  };

  // Close create dialog
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setNewOrder({
      supplier: "",
      items: [{ productId: "", name: "", quantity: 1, price: 0, total: 0 }],
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Handle new order form change
  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value,
    });
  };

  // Add item to new order
  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [
        ...newOrder.items,
        { productId: "", name: "", quantity: 1, price: 0, total: 0 },
      ],
    });
  };

  // Remove item from new order
  const handleRemoveItem = (index) => {
    const updatedItems = [...newOrder.items];
    updatedItems.splice(index, 1);
    setNewOrder({
      ...newOrder,
      items: updatedItems,
    });
  };

  // Handle item change in new order
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];

    if (field === "productId") {
      // Find product details
      const selectedProduct = products.find((p) => p.id === parseInt(value));
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          total: selectedProduct.price * updatedItems[index].quantity,
        };
      }
    } else if (field === "quantity") {
      const quantity = parseInt(value) || 0;
      updatedItems[index] = {
        ...updatedItems[index],
        quantity,
        total: quantity * updatedItems[index].price,
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
    }

    setNewOrder({
      ...newOrder,
      items: updatedItems,
    });
  };

  // Calculate total amount of new order
  const calculateTotalAmount = () => {
    return newOrder.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  // Save new purchase order
  const handleSaveOrder = () => {
    const totalAmount = calculateTotalAmount();

    const orderToAdd = {
      ...newOrder,
      id: `PO${10000 + purchaseOrders.length + 1}`,
      totalAmount,
    };

    // Add to local state
    setPurchaseOrders([orderToAdd, ...purchaseOrders]);

    // Show success message
    setSuccessMessage(`Purchase order ${orderToAdd.id} created successfully.`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    // Close dialog
    handleCloseCreateDialog();
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setOrderToDelete(null);
  };

  // Confirm order deletion
  const handleConfirmDelete = () => {
    // Remove from local state
    setPurchaseOrders(
      purchaseOrders.filter((order) => order.id !== orderToDelete.id)
    );

    // Show success message
    setSuccessMessage(
      `Purchase order ${orderToDelete.id} deleted successfully.`
    );
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    // Close dialog
    handleCloseDeleteDialog();
  };

  // Update order status
  const handleUpdateStatus = (orderId, newStatus) => {
    // Update in local state
    setPurchaseOrders(
      purchaseOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          return updatedOrder;
        }
        return order;
      })
    );

    // Show success message
    setSuccessMessage(`Purchase order ${orderId} marked as ${newStatus}.`);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Delivered":
        return "info";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Success message alert */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}

      {/* Filters and Create button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search orders..."
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ width: "250px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateOrder}
        >
          Create Order
        </Button>
      </Box>

      {/* Purchase orders table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 800 }} size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell>
                <Typography variant="subtitle2">Order ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Date</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Supplier</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">Total Amount</Typography>
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
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    Loading purchase orders...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length > 0 ? (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(order.date)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.supplier}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        color={getStatusColor(order.status)}
                        sx={{ minWidth: "90px" }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleViewOrder(order)}
                          title="View Order"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>

                        {order.status === "Pending" && (
                          <>
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleUpdateStatus(order.id, "Approved")
                              }
                              title="Approve Order"
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleUpdateStatus(order.id, "Cancelled")
                              }
                              title="Cancel Order"
                            >
                              <RejectIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}

                        {order.status === "Approved" && (
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handleUpdateStatus(order.id, "Delivered")
                            }
                            title="Mark as Delivered"
                          >
                            <SupplierIcon fontSize="small" />
                          </IconButton>
                        )}

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(order)}
                          title="Delete Order"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No purchase orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* View Order Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Purchase Order: {currentOrder?.id}
            </Typography>
            <Chip
              label={currentOrder?.status}
              size="small"
              color={getStatusColor(currentOrder?.status)}
            />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {currentOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(currentOrder.date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1">
                    {currentOrder.supplier}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom>
                Order Items
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "grey.50" }}>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{ fontWeight: "bold" }}
                      >
                        Total Amount:
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {formatCurrency(currentOrder.totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {currentOrder.status === "Pending" && (
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<ApproveIcon />}
                    onClick={() => {
                      handleUpdateStatus(currentOrder.id, "Approved");
                      handleCloseViewDialog();
                    }}
                  >
                    Approve Order
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<RejectIcon />}
                    onClick={() => {
                      handleUpdateStatus(currentOrder.id, "Cancelled");
                      handleCloseViewDialog();
                    }}
                  >
                    Cancel Order
                  </Button>
                </Box>
              )}

              {currentOrder.status === "Approved" && (
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={<SupplierIcon />}
                    onClick={() => {
                      handleUpdateStatus(currentOrder.id, "Delivered");
                      handleCloseViewDialog();
                    }}
                  >
                    Mark as Delivered
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Create Purchase Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Purchase Order</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="date"
                  label="Order Date"
                  type="date"
                  value={newOrder.date}
                  onChange={handleNewOrderChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="supplier-label">Supplier</InputLabel>
                  <Select
                    labelId="supplier-label"
                    id="supplier"
                    name="supplier"
                    value={newOrder.supplier}
                    label="Supplier"
                    onChange={handleNewOrderChange}
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
              Order Items
            </Typography>

            {newOrder.items.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth required>
                      <InputLabel id={`product-label-${index}`}>
                        Product
                      </InputLabel>
                      <Select
                        labelId={`product-label-${index}`}
                        id={`product-${index}`}
                        value={item.productId}
                        label="Product"
                        onChange={(e) =>
                          handleItemChange(index, "productId", e.target.value)
                        }
                      >
                        {products.map((product) => (
                          <MenuItem key={product.id} value={product.id}>
                            {product.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      fullWidth
                      required
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Price (₹)"
                      type="number"
                      value={item.price}
                      disabled
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₹</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      label="Total"
                      value={formatCurrency(item.total || 0)}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={1}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(index)}
                      disabled={newOrder.items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}

            <Box sx={{ mt: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Typography variant="subtitle1">Total Amount:</Typography>
              <Typography variant="h6">
                {formatCurrency(calculateTotalAmount())}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Cancel</Button>
          <Button
            onClick={handleSaveOrder}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={
              !newOrder.supplier ||
              !newOrder.items.length ||
              newOrder.items.some(
                (item) => !item.productId || !item.quantity
              ) ||
              calculateTotalAmount() === 0
            }
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete purchase order "{orderToDelete?.id}
            "? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrderManagement;
