import React from "react";
import { Paper, Box, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";

// Safari themed emojis based on card type
const getSafariEmoji = (colorStr) => {
  if (colorStr.includes("2e7d32") || colorStr.includes("success")) return "🌿";
  if (colorStr.includes("ed6c02") || colorStr.includes("warning")) return "🦁";
  if (colorStr.includes("ef4444") || colorStr.includes("error")) return "🔥";
  if (colorStr.includes("9c27b0") || colorStr.includes("accent")) return "🐘";
  if (colorStr.includes("1976d2") || colorStr.includes("primary")) return "🦓";
  return "🌴";
};

const StatsCard = ({
  title,
  value,
  icon,
  color = "primary",
  loading = false,
  subtitle,
  trend,
  trendLabel,
  className,
}) => {
  // Map custom colors to standard MUI colors for CircularProgress
  const getCircularProgressColor = (colorName) => {
    switch (colorName) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "primary";
    }
  };

  // Determine the icon class based on the color
  const getIconClass = (colorStr) => {
    if (colorStr.includes("2e7d32") || colorStr.includes("success"))
      return "success";
    if (colorStr.includes("ed6c02") || colorStr.includes("warning"))
      return "warning";
    if (colorStr.includes("ef4444") || colorStr.includes("error"))
      return "error";
    if (colorStr.includes("9c27b0") || colorStr.includes("accent"))
      return "accent";
    return "";
  };

  const iconClass = getIconClass(color);
  const safariEmoji = getSafariEmoji(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "20px",
          background:
            "linear-gradient(145deg, var(--card-background), rgba(26, 56, 41, 0.7))",
          boxShadow: "0 10px 20px var(--shadow-color)",
          overflow: "visible",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%232e7d32' fill-opacity='0.06' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "100px 100px",
            top: 0,
            left: 0,
            zIndex: 0,
            opacity: 0.5,
            borderRadius: "20px",
          },
          "&::after": {
            content: `"${safariEmoji}"`,
            position: "absolute",
            fontSize: "30px",
            opacity: 0.2,
            bottom: "10px",
            right: "15px",
            zIndex: 0,
          },
          transition: "all 0.3s ease",
          border: "1px solid rgba(46, 125, 50, 0.2)",
        }}
        className={className}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          gutterBottom
          sx={{
            position: "relative",
            zIndex: 1,
            fontWeight: 500,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "var(--text-secondary)",
          }}
          className="stats-label"
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1,
          }}
        >
          {loading ? (
            <Skeleton variant="text" width="50%" height={60} />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Typography
                variant="h3"
                component="div"
                className="stats-value"
                sx={{
                  background:
                    "linear-gradient(to right, var(--text-primary), var(--accent-color))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontWeight: 700,
                  textShadow: "0 2px 10px rgba(255, 255, 255, 0.1)",
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {subtitle}
                </Typography>
              )}
            </motion.div>
          )}

          <Box
            component={motion.div}
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              position: "absolute",
              top: "-15px",
              right: "20px",
              width: "60px",
              height: "60px",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 8px 16px rgba(46, 125, 50, 0.3)",
              zIndex: 2,
            }}
            className={`stats-card-icon ${iconClass}`}
          >
            {React.cloneElement(icon, {
              sx: {
                color: "white",
                fontSize: 28,
              },
            })}
          </Box>
        </Box>

        {trend && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component={motion.div}
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`stats-trend ${trend > 0 ? "up" : "down"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </Box>
            {trendLabel && (
              <Typography variant="caption" color="text.secondary">
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default StatsCard;
