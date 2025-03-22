import React from "react";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { Receipt as ReceiptIcon } from "@mui/icons-material";

const PendingOrders = ({ orders, loading, onViewAllClick }) => {
  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ReceiptIcon sx={{ color: "#2e7d32", mr: 1 }} />
          Pending Purchase Orders
        </Typography>
        <Chip
          label={loading ? "..." : `${orders.length} orders`}
          color="primary"
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CircularProgress />
        </Box>
      ) : orders.length > 0 ? (
        <>
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <ListItem>
                  <ListItemText
                    primary={`Order #${order.orderNumber}`}
                    secondary={`Supplier: ${
                      order.supplier
                    } | Expected: ${formatDate(order.expectedDate)}`}
                  />
                  <Chip
                    label={order.status}
                    color={order.status === "Approved" ? "success" : "info"}
                    size="small"
                  />
                </ListItem>
                {index < orders.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={onViewAllClick}
            >
              View All Purchase Orders
            </Button>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "text.secondary",
          }}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            No pending purchase orders
          </Typography>
          <Typography variant="body2">
            All purchase orders have been processed
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Default props for demo
PendingOrders.defaultProps = {
  orders: [],
  loading: false,
  onViewAllClick: () => {},
};

export default PendingOrders;
