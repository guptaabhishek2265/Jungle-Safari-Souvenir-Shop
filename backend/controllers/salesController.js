const mongoose = require("mongoose");
const axios = require("axios");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

// @desc    Create a new sale
// @route   POST /api/sales
// @access  Private
exports.createSale = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customerId,
      customerName,
      items,
      paymentMethod,
      total,
      tax,
      subtotal,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the sale" });
    }

    // Create new sale
    const newSale = new Sale({
      customer: {
        id: customerId,
        name: customerName || "Walk-in Customer",
      },
      items: items.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      subtotal,
      tax,
      paymentMethod,
      saleDate: new Date(),
      createdBy: req.user.id,
    });

    const sale = await newSale.save({ session });

    // Update inventory after sale
    try {
      // Call the inventory update endpoint
      await axios.put(
        "http://localhost:5000/api/inventory/update-stock-sale",
        {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: req.headers.authorization,
          },
        }
      );
    } catch (error) {
      console.error("Error updating inventory:", error);
      // Continue with sale creation even if inventory update fails
      // In a production environment, you might want to handle this differently
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(sale);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private (Admin, Sales)
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .sort({ saleDate: -1 })
      .populate("createdBy", "name");

    res.json(sales);
  } catch (error) {
    console.error("Error getting sales:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get sale by ID
// @route   GET /api/sales/:id
// @access  Private (Admin, Sales)
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "createdBy",
      "name"
    );

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    console.error("Error getting sale:", error);

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get sales report
// @route   GET /api/sales/report
// @access  Private (Admin, Sales)
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.saleDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const sales = await Sale.find(query).sort({ saleDate: -1 });

    // Calculate summary metrics
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItems = sales.reduce((sum, sale) => {
      return (
        sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
      );
    }, 0);

    // Get top selling products
    const productCounts = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productCounts[item.name]) {
          productCounts[item.name] = {
            quantity: 0,
            revenue: 0,
          };
        }
        productCounts[item.name].quantity += item.quantity;
        productCounts[item.name].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.keys(productCounts)
      .map((name) => ({
        name,
        quantity: productCounts[name].quantity,
        revenue: productCounts[name].revenue,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      totalSales,
      totalRevenue,
      totalItems,
      topProducts,
      sales: sales.map((sale) => ({
        id: sale._id,
        date: sale.saleDate,
        customer: sale.customer.name,
        total: sale.total,
        items: sale.items.length,
      })),
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: "Server error" });
  }
};
