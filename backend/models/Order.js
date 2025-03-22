const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  items: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
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
      },
    },
  ],
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
  },
  subtotal: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ["card", "upi", "netbanking", "cash"],
    },
    transactionId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "completed",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
