const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} = require("../controllers/productController");

// Get all products
router.get("/", protect, getProducts);

// Get low stock products
router.get("/low-stock", protect, getLowStockProducts);

// Get single product
router.get("/:id", protect, getProduct);

// Create a product - only admin and inventory manager can do this
router.post(
  "/",
  protect,
  authorize("admin", "inventory_manager"),
  createProduct
);

// Update a product - only admin and inventory manager can do this
router.put(
  "/:id",
  protect,
  authorize("admin", "inventory_manager"),
  updateProduct
);

// Delete a product - only admin and inventory manager can do this
router.delete(
  "/:id",
  protect,
  authorize("admin", "inventory_manager"),
  deleteProduct
);

module.exports = router;
