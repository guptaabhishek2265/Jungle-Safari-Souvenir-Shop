const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getInventory,
  getProductInventory,
  updateStockAfterSale,
  updateStockAfterPurchase,
  getLowStock,
  adjustInventory,
} = require("../controllers/inventoryController");

// Get all inventory
router.get("/", protect, getInventory);

// Get low stock items
router.get("/low-stock", protect, getLowStock);

// Get inventory for a specific product
router.get("/:productId", protect, getProductInventory);

// Update inventory after a sale
router.put(
  "/update-stock-sale",
  protect,
  authorize("admin", "sales", "inventory_manager"),
  updateStockAfterSale
);

// Update inventory after purchase order delivery
router.put(
  "/update-stock-purchase",
  protect,
  authorize("admin", "inventory_manager"),
  updateStockAfterPurchase
);

// Manually adjust inventory for a product
router.put(
  "/adjust/:productId",
  protect,
  authorize("admin", "inventory_manager"),
  adjustInventory
);

module.exports = router;
