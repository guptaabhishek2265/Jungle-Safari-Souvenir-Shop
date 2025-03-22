const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    reorderLevel: {
      type: Number,
      required: true,
      min: 0,
    },
    lastStockUpdate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", InventorySchema);

module.exports = Inventory;
