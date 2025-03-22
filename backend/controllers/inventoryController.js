const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// Event emitter for real-time updates
const eventEmitter = require("../utils/eventEmitter");

// @desc    Update inventory stock after a sale
// @route   PUT /api/inventory/update-stock-sale
// @access  Private
exports.updateStockAfterSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "No items provided for stock update" });
    }

    const updatedItems = [];
    const lowStockItems = [];

    // Process each item in the sale
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        continue;
      }

      // Find inventory for the product
      const inventory = await Inventory.findOne({
        product: productId,
      }).populate("product");

      if (!inventory) {
        continue;
      }

      // Calculate new quantity and update
      const newQuantity = Math.max(0, inventory.quantity - quantity);
      inventory.quantity = newQuantity;
      inventory.lastStockUpdate = new Date();
      await inventory.save({ session });

      updatedItems.push({
        productId,
        name: inventory.product.name,
        previousStock: inventory.quantity + quantity,
        newStock: newQuantity,
        change: -quantity,
      });

      // Check if stock is below reorder level
      if (newQuantity <= inventory.reorderLevel) {
        lowStockItems.push({
          productId,
          name: inventory.product.name,
          sku: inventory.product.sku,
          stock: newQuantity,
          reorderLevel: inventory.reorderLevel,
        });
      }
    }

    await session.commitTransaction();
    session.endSession();

    // Emit events for real-time updates
    if (updatedItems.length > 0) {
      eventEmitter.emit("stockUpdated", updatedItems);
    }

    if (lowStockItems.length > 0) {
      eventEmitter.emit("lowStock", lowStockItems);
    }

    res.json({
      success: true,
      updatedItems,
      lowStockItems: lowStockItems.length > 0 ? lowStockItems : null,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating stock after sale:", error);
    res
      .status(500)
      .json({ message: "Failed to update inventory", error: error.message });
  }
};

// @desc    Update inventory stock after purchase order delivery
// @route   PUT /api/inventory/update-stock-purchase
// @access  Private (Admin, Inventory Manager)
exports.updateStockAfterPurchase = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, purchaseOrderId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "No items provided for stock update" });
    }

    const updatedItems = [];

    // Process each item in the purchase order
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        continue;
      }

      // Find inventory for the product
      let inventory = await Inventory.findOne({ product: productId }).populate(
        "product"
      );

      // If inventory doesn't exist, create one
      if (!inventory) {
        const product = await Product.findById(productId);
        if (!product) continue;

        inventory = new Inventory({
          product: productId,
          quantity: 0,
          reorderLevel: 10,
          location: "Main Warehouse",
          lastStockUpdate: new Date(),
        });
      }

      // Update quantity
      const previousQuantity = inventory.quantity;
      inventory.quantity += quantity;
      inventory.lastStockUpdate = new Date();
      await inventory.save({ session });

      updatedItems.push({
        productId,
        name: inventory.product ? inventory.product.name : "Unknown Product",
        previousStock: previousQuantity,
        newStock: inventory.quantity,
        change: quantity,
      });
    }

    await session.commitTransaction();
    session.endSession();

    // Emit event for real-time updates
    if (updatedItems.length > 0) {
      eventEmitter.emit("stockUpdated", updatedItems);
    }

    res.json({
      success: true,
      updatedItems,
      purchaseOrderId,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating stock after purchase:", error);
    res
      .status(500)
      .json({ message: "Failed to update inventory", error: error.message });
  }
};

// @desc    Get current inventory levels for all products
// @route   GET /api/inventory
// @access  Private
exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find().populate("product");

    const formattedInventory = inventory.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      sku: item.product.sku,
      stock: item.quantity,
      reorderLevel: item.reorderLevel,
      location: item.location,
      lastUpdated: item.lastStockUpdate,
    }));

    res.json(formattedInventory);
  } catch (error) {
    console.error("Error retrieving inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get inventory details for a specific product
// @route   GET /api/inventory/:productId
// @access  Private
exports.getProductInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({
      product: req.params.productId,
    }).populate("product");

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Inventory not found for this product" });
    }

    res.json({
      productId: inventory.product._id,
      name: inventory.product.name,
      sku: inventory.product.sku,
      stock: inventory.quantity,
      reorderLevel: inventory.reorderLevel,
      location: inventory.location,
      lastUpdated: inventory.lastStockUpdate,
    });
  } catch (error) {
    console.error("Error retrieving product inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all low stock items
// @route   GET /api/inventory/low-stock
// @access  Private
exports.getLowStock = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
    }).populate("product");

    const formattedItems = lowStockItems.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      sku: item.product.sku,
      stock: item.quantity,
      reorderLevel: item.reorderLevel,
      location: item.location,
      lastUpdated: item.lastStockUpdate,
      deficit: item.reorderLevel - item.quantity,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error("Error retrieving low stock items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Manually adjust inventory for a product
// @route   PUT /api/inventory/adjust/:productId
// @access  Private (Admin, Inventory Manager)
exports.adjustInventory = async (req, res) => {
  try {
    const { adjustment, reason } = req.body;

    if (adjustment === undefined) {
      return res.status(400).json({ message: "Adjustment value is required" });
    }

    const inventory = await Inventory.findOne({
      product: req.params.productId,
    }).populate("product");

    if (!inventory) {
      return res
        .status(404)
        .json({ message: "Inventory not found for this product" });
    }

    // Record previous quantity for event
    const previousQuantity = inventory.quantity;

    // Apply adjustment
    inventory.quantity = Math.max(0, inventory.quantity + adjustment);
    inventory.lastStockUpdate = new Date();
    await inventory.save();

    // Emit stock update event
    eventEmitter.emit("stockUpdated", [
      {
        productId: inventory.product._id,
        name: inventory.product.name,
        previousStock: previousQuantity,
        newStock: inventory.quantity,
        change: adjustment,
        reason: reason || "Manual adjustment",
      },
    ]);

    // Check if low stock after adjustment
    if (inventory.quantity <= inventory.reorderLevel) {
      eventEmitter.emit("lowStock", [
        {
          productId: inventory.product._id,
          name: inventory.product.name,
          sku: inventory.product.sku,
          stock: inventory.quantity,
          reorderLevel: inventory.reorderLevel,
        },
      ]);
    }

    res.json({
      success: true,
      productId: inventory.product._id,
      name: inventory.product.name,
      previousStock: previousQuantity,
      newStock: inventory.quantity,
      change: adjustment,
      reason: reason || "Manual adjustment",
    });
  } catch (error) {
    console.error("Error adjusting inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
