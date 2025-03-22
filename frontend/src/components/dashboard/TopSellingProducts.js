import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { ShoppingBag, Inventory } from "@mui/icons-material";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

// Safari product icons
const SAFARI_ICONS = {
  "Safari Hat": "🧢",
  Binoculars: "🔭",
  "Water Bottle": "🧴",
  "Trail Mix": "🥜",
  "Hiking Boots": "👢",
  Tent: "⛺",
  Camera: "📷",
  Sunscreen: "🧴",
  "Safari Shirt": "👕",
  Map: "🗺️",
  Compass: "🧭",
  Flashlight: "🔦",
  "First Aid Kit": "🩹",
  "Safari Guide": "📔",
  "Insect Repellent": "🦟",
};

const TopSellingProducts = ({ products = [], height = 350, className }) => {
  const theme = useTheme();

  // Default products if not provided
  const defaultProducts = [
    { name: "Safari Hat", sales: 18, amount: 10782, image: "🧢" },
    { name: "Binoculars", sales: 12, amount: 23988, image: "🔭" },
    { name: "Water Bottle", sales: 24, amount: 10800, image: "🧴" },
    { name: "Trail Mix", sales: 36, amount: 4320, image: "🥜" },
    { name: "Hiking Boots", sales: 15, amount: 18750, image: "👢" },
  ];

  const displayProducts = products.length > 0 ? products : defaultProducts;

  // Find max sales for progress calculation
  const maxSales = Math.max(...displayProducts.map((product) => product.sales));

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Function to get jungle-themed colors for each item
  const getItemColor = (index) => {
    const jungleColors = [
      "#2e7d32", // dark green
      "#66bb6a", // light green
      "#ff9800", // amber
      "#8d6e63", // brown
      "#4caf50", // green
    ];
    return jungleColors[index % jungleColors.length];
  };

  // Get icon for product (either from image prop or lookup in SAFARI_ICONS)
  const getProductIcon = (product) => {
    if (product.image) return product.image;
    return SAFARI_ICONS[product.name] || "🌴";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          backgroundImage:
            "linear-gradient(145deg, var(--card-background), rgba(26, 56, 41, 0.7))",
          boxShadow: "0 10px 20px var(--shadow-color)",
          height: height,
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(46, 125, 50, 0.2)",
          "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            background: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0a9 9 0 0 0-9 9v30a9 9 0 0 0 9 9h30a9 9 0 0 0 9-9V9a9 9 0 0 0-9-9H9zm0 2h30a7 7 0 0 1 7 7v30a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7V9a7 7 0 0 1 7-7zm13 12a2 2 0 1 0-4 0v14a2 2 0 1 0 4 0v-3.513l12.84 8.139a2 2 0 1 0 2.16-3.372L24.157 21l12.836-8.243a2 2 0 1 0-2.155-3.374L22 17.513V14z' fill='%232e7d32' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "120px 120px",
            zIndex: 0,
            opacity: 0.5,
          },
          "&::after": {
            content: '"🦒"',
            position: "absolute",
            fontSize: "40px",
            opacity: 0.1,
            bottom: "20px",
            right: "20px",
            zIndex: 0,
          },
        }}
        className={className}
      >
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            style={{ marginRight: "10px" }}
          >
            <ShoppingBag sx={{ color: "var(--accent-color)" }} />
          </motion.div>
          <Typography
            variant="h6"
            fontWeight={600}
            className="sales-chart-title"
            sx={{ color: "var(--text-primary)" }}
          >
            Top Safari Products
          </Typography>
        </Box>

        <Divider
          sx={{
            mb: 2,
            opacity: 0.5,
            borderColor: "var(--border-color)",
          }}
        />

        <List
          component={motion.ul}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            maxHeight: height - 100,
            overflow: "auto",
            position: "relative",
            zIndex: 1,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(15, 34, 23, 0.2)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "var(--primary-color)",
              borderRadius: "4px",
              "&:hover": {
                background: "var(--accent-color)",
              },
            },
          }}
        >
          {displayProducts.map((product, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 3 }}
            >
              <ListItem
                sx={{
                  py: 1.5,
                  px: 1,
                  borderRadius: "12px",
                  mb: 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  },
                }}
                className="product-list-item"
              >
                <Avatar
                  sx={{
                    mr: 2,
                    bgcolor: `${getItemColor(index)}20`,
                    color: getItemColor(index),
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    boxShadow: `0 4px 8px rgba(0,0,0,0.1)`,
                    border: `1px solid ${getItemColor(index)}40`,
                  }}
                >
                  {getProductIcon(product)}
                </Avatar>
                <Box sx={{ width: "100%" }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={0.5}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ color: "var(--text-primary)" }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        background: `linear-gradient(to right, ${getItemColor(
                          index
                        )}, var(--accent-color))`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {formatCurrency(product.amount)}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={(product.sales / maxSales) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(255,255,255,0.08)",
                          "& .MuiLinearProgress-bar": {
                            backgroundImage: `linear-gradient(90deg, ${getItemColor(
                              index
                            )}, ${getItemColor((index + 1) % 5)})`,
                            borderRadius: 3,
                          },
                        }}
                        className="product-progress-bar"
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--text-secondary)",
                        display: "flex",
                        alignItems: "center",
                        "&::before": {
                          content: '"📦"',
                          marginRight: "4px",
                          fontSize: "10px",
                        },
                      }}
                    >
                      {product.sales} units
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
            </motion.li>
          ))}
        </List>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40px",
            background:
              "linear-gradient(transparent, rgba(15, 34, 23, 0.9) 60%)",
            zIndex: 0,
          }}
        />
      </Paper>
    </motion.div>
  );
};

export default TopSellingProducts;
