const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    customer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      name: {
        type: String,
        required: true,
        default: "Walk-in Customer",
      },
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "credit_card", "debit_card", "mobile_payment", "other"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["paid", "pending", "failed"],
      default: "paid",
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
    },
    inventoryUpdated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sale", SaleSchema);
