import React, { useState, useContext } from "react";
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Button,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  AutorenewOutlined as AutorenewIcon,
  InfoOutlined as InfoIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { InventoryContext } from "../../pages/inventory/Dashboard";

const AutoReorderSettings = () => {
  const {
    autoReorderEnabled,
    autoReorderThreshold,
    toggleAutoReorder,
    updateAutoReorderThreshold,
    reorderNotifications,
    clearReorderNotification,
    stats,
  } = useContext(InventoryContext);

  const [threshold, setThreshold] = useState(autoReorderThreshold);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle toggling auto-reorder
  const handleToggleAutoReorder = (event) => {
    toggleAutoReorder(event.target.checked);

    if (event.target.checked) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // Handle threshold change
  const handleThresholdChange = (event, newValue) => {
    setThreshold(newValue);
  };

  // Handle threshold input change
  const handleThresholdInputChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setThreshold(Math.max(1, Math.min(20, value)));
    }
  };

  // Apply threshold changes
  const handleApplyThreshold = () => {
    updateAutoReorderThreshold(threshold);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Format date for notifications
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, border: "1px solid", borderColor: "divider" }}
      id="auto-reorder-settings"
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <AutorenewIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Automated Reorder System
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings updated successfully!
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={autoReorderEnabled}
              onChange={handleToggleAutoReorder}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography>Enable Automatic Reordering</Typography>
              <Tooltip title="When enabled, the system will automatically create purchase orders for items below the threshold">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />

        <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
          {autoReorderEnabled
            ? "Automatic reordering is enabled. The system will create purchase orders for products below threshold."
            : "Automatic reordering is disabled. Enable to automate purchase orders for low stock items."}
        </Alert>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography gutterBottom>
          Reorder Threshold (Quantity)
          <Tooltip title="Products with stock at or below this threshold will trigger automatic reorders">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Slider
            value={threshold}
            onChange={handleThresholdChange}
            aria-labelledby="reorder-threshold-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={20}
            disabled={!autoReorderEnabled}
            sx={{ mr: 2, flex: 1 }}
          />

          <TextField
            value={threshold}
            onChange={handleThresholdInputChange}
            disabled={!autoReorderEnabled}
            inputProps={{
              step: 1,
              min: 1,
              max: 20,
              type: "number",
            }}
            sx={{ width: 80 }}
            size="small"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyThreshold}
            disabled={!autoReorderEnabled || threshold === autoReorderThreshold}
            startIcon={<SaveIcon />}
            sx={{ ml: 2 }}
            size="small"
          >
            Apply
          </Button>
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
          System Status
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <Paper variant="outlined" sx={{ p: 2, flex: "1 1 200px" }}>
            <Typography variant="body2" color="textSecondary">
              Current Threshold
            </Typography>
            <Typography variant="h5">{autoReorderThreshold} units</Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, flex: "1 1 200px" }}>
            <Typography variant="body2" color="textSecondary">
              Low Stock Items
            </Typography>
            <Typography variant="h5">{stats.lowStockItems}</Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2, flex: "1 1 200px" }}>
            <Typography variant="body2" color="textSecondary">
              Status
            </Typography>
            <Typography
              variant="h5"
              color={autoReorderEnabled ? "success.main" : "text.secondary"}
            >
              {autoReorderEnabled ? "Active" : "Inactive"}
            </Typography>
          </Paper>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Recent Reorder Notifications ({reorderNotifications.length})
        </Typography>

        {reorderNotifications.length === 0 ? (
          <Alert severity="info">No recent reorder notifications</Alert>
        ) : (
          <Box sx={{ maxHeight: 300, overflow: "auto" }}>
            {reorderNotifications.slice(0, 5).map((notification) => (
              <Paper
                key={notification.id}
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 1,
                  borderLeft: "4px solid",
                  borderLeftColor:
                    notification.status === "pending"
                      ? "warning.main"
                      : "success.main",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">
                      {notification.productName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Stock: {notification.currentStock} / Reorder Level:{" "}
                      {notification.reorderLevel}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(notification.timestamp)}
                    </Typography>
                  </Box>
                  <Box>
                    <Tooltip
                      title={
                        notification.status === "pending"
                          ? "Pending Reorder"
                          : "Order Processed"
                      }
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        color={
                          notification.status === "pending"
                            ? "warning"
                            : "success"
                        }
                        onClick={() =>
                          clearReorderNotification(notification.id)
                        }
                      >
                        {notification.status === "pending"
                          ? "Pending"
                          : "Processed"}
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}

            {reorderNotifications.length > 5 && (
              <Button fullWidth variant="text" color="primary" sx={{ mt: 1 }}>
                View All Notifications ({reorderNotifications.length})
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default AutoReorderSettings;
