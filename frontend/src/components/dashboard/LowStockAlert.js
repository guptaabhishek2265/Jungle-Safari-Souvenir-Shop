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
import { Warning as WarningIcon } from "@mui/icons-material";

const LowStockAlert = ({ items, loading, onViewAllClick }) => {
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
          <WarningIcon sx={{ color: "#f57c00", mr: 1 }} />
          Low Stock Alerts
        </Typography>
        <Chip
          label={loading ? "..." : `${items.length} items`}
          color="warning"
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
      ) : items.length > 0 ? (
        <>
          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText
                    primary={item.name}
                    secondary={`Current Stock: ${item.quantity} | Reorder Level: ${item.reorderLevel}`}
                  />
                  <Chip
                    label={`${item.quantity} left`}
                    color={
                      item.quantity <= item.reorderLevel / 2
                        ? "error"
                        : "warning"
                    }
                    size="small"
                  />
                </ListItem>
                {index < items.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              onClick={onViewAllClick}
            >
              View All Low Stock Items
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
            All items are well stocked
          </Typography>
          <Typography variant="body2">
            No low stock alerts at this time
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Default props for demo
LowStockAlert.defaultProps = {
  items: [],
  loading: false,
  onViewAllClick: () => {},
};

export default LowStockAlert;
