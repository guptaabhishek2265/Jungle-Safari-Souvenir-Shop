const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getSales,
  getSaleById,
  createSale,
  getSalesReport,
} = require("../controllers/salesController");

// Get all sales
router.get("/", protect, authorize("admin", "sales"), getSales);

// Get sales report
router.get("/report", protect, authorize("admin", "sales"), getSalesReport);

// Get a specific sale
router.get("/:id", protect, authorize("admin", "sales"), getSaleById);

// Create a new sale
router.post("/", protect, authorize("admin", "sales"), createSale);

module.exports = router;
