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
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const PurchaseOrdersTable = ({
  orders,
  loading,
  onCreateOrder,
  onViewOrder,
  onUpdateStatus,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    status: "",
    orderId: null,
  });

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

  const handleOpenMenu = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenStatusDialog = (status) => {
    setStatusDialog({ open: true, status, orderId: selectedOrder.id });
    handleCloseMenu();
  };

  const handleCloseStatusDialog = () => {
    setStatusDialog({ open: false, status: "", orderId: null });
  };

  const handleUpdateStatus = () => {
    onUpdateStatus(statusDialog.orderId, statusDialog.status);
    handleCloseStatusDialog();
  };

  const handleViewOrder = () => {
    onViewOrder(selectedOrder);
    handleCloseMenu();
  };

  const filteredOrders = orders
    ? orders.filter((order) => {
        const orderNumber = order.orderNumber || "";
        const supplierName =
          order.supplier && order.supplier.name ? order.supplier.name : "";
        const status = order.status || "";

        return (
          orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      case "processing":
        return "info";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Purchase Orders</Typography>
          <Button variant="contained" color="primary" onClick={onCreateOrder}>
            Create Order
          </Button>
        </Box>

        <TextField
          placeholder="Search by order #, supplier or status"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Loading purchase orders...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No purchase orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow hover tabIndex={-1} key={order.id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {order.supplier?.name || 'Unknown Supplier'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.supplier?.contactPerson || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.items?.length || 0} items</TableCell>
                    <TableCell align="right">
                      ${order.total !== undefined && order.total !== null ? order.total.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>{order.orderDate ? formatDate(order.orderDate) : 'N/A'}</TableCell>
                    <TableCell>
                      {order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status || 'Unknown'}
                        color={getStatusColor(order.status || '')}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenMenu(e, order)}
                      >
                        <MoreIcon fontSize="small" />
                      </IconButton>
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
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleViewOrder}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {selectedOrder && selectedOrder.status === "Pending" && (
          <MenuItem onClick={() => handleOpenStatusDialog("Delivered")}>
            <CheckIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Delivered
          </MenuItem>
        )}
        {selectedOrder && selectedOrder.status === "Pending" && (
          <MenuItem onClick={() => handleOpenStatusDialog("Cancelled")}>
            <CancelIcon fontSize="small" sx={{ mr: 1 }} />
            Cancel Order
          </MenuItem>
        )}
      </Menu>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog.open} onClose={handleCloseStatusDialog}>
        <DialogTitle>
          {statusDialog.status === "Delivered"
            ? "Mark as Delivered"
            : "Cancel Order"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {statusDialog.status === "Delivered"
              ? "Are you sure you want to mark this order as delivered? This will update inventory stock levels."
              : "Are you sure you want to cancel this order?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>No</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color={statusDialog.status === "Delivered" ? "success" : "error"}
          >
            Yes,{" "}
            {statusDialog.status === "Delivered"
              ? "Mark as Delivered"
              : "Cancel Order"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PurchaseOrdersTable;
