const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("../middleware/auth");

// Mock purchase orders data for demo purposes
const purchaseOrders = [
  {
    _id: "po1",
    supplier: "1",
    supplierName: "Wilderness Outfitters",
    orderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "pending",
    items: [
      {
        product: "prod1",
        productName: "Hiking Boots",
        sku: "HB-001",
        quantity: 10,
        price: 45.99,
      },
      {
        product: "prod2",
        productName: "Camping Tent",
        sku: "CT-002",
        quantity: 5,
        price: 129.99,
      },
    ],
    totalAmount: 1109.85,
    notes: "Expedition gear restocking",
  },
  {
    _id: "po2",
    supplier: "2",
    supplierName: "Safari Supplies Inc",
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "confirmed",
    items: [
      {
        product: "prod3",
        productName: "First Aid Kit",
        sku: "FAK-001",
        quantity: 20,
        price: 24.99,
      },
      {
        product: "prod4",
        productName: "Energy Bars",
        sku: "EB-002",
        quantity: 100,
        price: 2.49,
      },
    ],
    totalAmount: 748.8,
    notes: "Rush order for upcoming safari tour",
  },
  {
    _id: "po3",
    supplier: "3",
    supplierName: "Jungle Gear Co.",
    orderDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    expectedDeliveryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: "delivered",
    items: [
      {
        product: "prod5",
        productName: "Safari Hat",
        sku: "SH-001",
        quantity: 50,
        price: 19.99,
      },
      {
        product: "prod6",
        productName: "Mosquito Net",
        sku: "MN-002",
        quantity: 30,
        price: 14.99,
      },
    ],
    totalAmount: 1449.2,
    notes: "Seasonal inventory replenishment",
  },
  {
    _id: "po4",
    supplier: "4",
    supplierName: "Adventure Equipment Ltd",
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: "pending",
    items: [
      {
        product: "prod7",
        productName: "Jungle Guide Book",
        sku: "JGB-001",
        quantity: 25,
        price: 15.99,
      },
      {
        product: "prod8",
        productName: "Safari Maps",
        sku: "SM-002",
        quantity: 40,
        price: 9.99,
      },
    ],
    totalAmount: 799.35,
    notes: "New merchandise for gift shop",
  },
];

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private (inventory manager and admin only)
router.get("/", protect, (req, res) => {
  // Check if user has proper permissions
  if (req.user.role !== "admin" && req.user.role !== "inventory_manager") {
    return res
      .status(403)
      .json({ message: "Not authorized to access purchase orders" });
  }

  res.json(purchaseOrders);
});

// @desc    Get a single purchase order
// @route   GET /api/purchase-orders/:id
// @access  Private (inventory manager and admin only)
router.get("/:id", protect, (req, res) => {
  // Check if user has proper permissions
  if (req.user.role !== "admin" && req.user.role !== "inventory_manager") {
    return res
      .status(403)
      .json({ message: "Not authorized to access purchase orders" });
  }

  const order = purchaseOrders.find((po) => po._id === req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Purchase order not found" });
  }

  res.json(order);
});

// @desc    Create a new purchase order
// @route   POST /api/purchase-orders
// @access  Private (inventory manager and admin only)
router.post("/", protect, (req, res) => {
  // Check if user has proper permissions
  if (req.user.role !== "admin" && req.user.role !== "inventory_manager") {
    return res
      .status(403)
      .json({ message: "Not authorized to create purchase orders" });
  }

  const { supplier, supplierName, expectedDeliveryDate, items, notes } =
    req.body;

  // Validation
  if (!supplier || !items || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide supplier and at least one item" });
  }

  // Calculate total amount
  const totalAmount = items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  // Create new purchase order
  const newOrder = {
    _id: `po${Date.now()}`, // Generate a unique ID
    supplier,
    supplierName: supplierName || "Unknown Supplier", // Use the supplier name from the request if available
    orderNumber: `PO-${Math.floor(10000 + Math.random() * 90000)}`, // Generate order number
    orderDate: new Date(),
    expectedDeliveryDate: new Date(expectedDeliveryDate),
    status: "pending",
    items,
    total: totalAmount, // Use total instead of totalAmount to match the frontend
    notes: notes || "",
  };

  // In a real application, you would save to database here
  // In this mock, we just add to our array
  purchaseOrders.unshift(newOrder);

  res.status(201).json(newOrder);
});

// @desc    Update purchase order status
// @route   PATCH /api/purchase-orders/:id/status
// @access  Private (inventory manager and admin only)
router.patch("/:id/status", protect, (req, res) => {
  // Check if user has proper permissions
  if (req.user.role !== "admin" && req.user.role !== "inventory_manager") {
    return res
      .status(403)
      .json({ message: "Not authorized to update purchase orders" });
  }

  const { status } = req.body;

  // Validation
  if (!status) {
    return res.status(400).json({ message: "Please provide a status" });
  }

  // Valid statuses
  const validStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  // Find order
  const orderIndex = purchaseOrders.findIndex((po) => po._id === req.params.id);

  if (orderIndex === -1) {
    return res.status(404).json({ message: "Purchase order not found" });
  }

  const order = purchaseOrders[orderIndex];
  const previousStatus = order.status;

  // Update status
  purchaseOrders[orderIndex].status = status;

  // If status is delivered and it wasn't delivered before, update inventory
  if (status === "delivered" && previousStatus !== "delivered") {
    // Call the inventory update endpoint
    try {
      const axios = require("axios");

      axios
        .put(
          "http://localhost:5000/api/inventory/update-stock-purchase",
          {
            items: order.items.map((item) => ({
              productId: item.product,
              quantity: item.quantity,
            })),
            purchaseOrderId: order._id,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          }
        )
        .then((response) => {
          console.log("Inventory updated successfully", response.data);
        })
        .catch((error) => {
          console.error("Error updating inventory:", error.message);
        });

      console.log(
        `Purchase order ${req.params.id} marked as delivered - inventory being updated`
      );
    } catch (error) {
      console.error("Error updating inventory:", error);
      // Continue even if inventory update fails
      // In a production app, you might want to handle this differently
    }
  }

  res.json(purchaseOrders[orderIndex]);
});

// @desc    Get low stock products for reordering
// @route   GET /api/purchase-orders/low-stock
// @access  Private (inventory manager and admin only)
router.get("/low-stock/products", protect, (req, res) => {
  // Check if user has proper permissions
  if (req.user.role !== "admin" && req.user.role !== "inventory_manager") {
    return res
      .status(403)
      .json({ message: "Not authorized to access reorder information" });
  }

  // Mock data for products that need reordering
  const lowStockProducts = [
    {
      _id: "prod1",
      name: "Hiking Boots",
      sku: "HB-001",
      category: "Footwear",
      stock: 5,
      reorderLevel: 10,
      supplier: "1",
      supplierName: "Wilderness Outfitters",
    },
    {
      _id: "prod4",
      name: "Energy Bars",
      sku: "EB-002",
      category: "Food",
      stock: 12,
      reorderLevel: 30,
      supplier: "2",
      supplierName: "Safari Supplies Inc",
    },
    {
      _id: "prod7",
      name: "Jungle Guide Book",
      sku: "JGB-001",
      category: "Books",
      stock: 3,
      reorderLevel: 8,
      supplier: "4",
      supplierName: "Adventure Equipment Ltd",
    },
  ];

  res.json(lowStockProducts);
});

module.exports = router;
