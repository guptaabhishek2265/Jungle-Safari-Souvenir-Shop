import React from "react";
import { Box, Container, Typography, Paper, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import "../dashboard/animations.css";

// Enhanced layout wrapper for dashboard components with animations
const DashboardLayout = ({ children, title }) => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          py: 3,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: `linear-gradient(180deg, ${theme.palette.primary.lighter}40 0%, transparent 100%)`,
            zIndex: -1,
            borderRadius: "0 0 50% 50% / 0 0 100px 100px",
          },
        }}
      >
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: 600,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "60px",
                  height: "4px",
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  borderRadius: "4px",
                },
              }}
            >
              {title}
            </Typography>
          </motion.div>
        )}

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {children}
        </motion.div>
      </Box>
    </Container>
  );
};

export default DashboardLayout;
