const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const eventEmitter = require("./utils/eventEmitter");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for client joining specific rooms
  socket.on("join", (rooms) => {
    if (Array.isArray(rooms)) {
      rooms.forEach((room) => socket.join(room));
    } else if (typeof rooms === "string") {
      socket.join(rooms);
    }
    console.log(
      `Client joined rooms: ${Array.isArray(rooms) ? rooms.join(", ") : rooms}`
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Setup event listeners for inventory updates
eventEmitter.on("stockUpdated", (data) => {
  io.to("inventory").emit("stockUpdated", data);
  console.log("Stock update event emitted:", data);
});

eventEmitter.on("lowStock", (data) => {
  io.to("inventory").emit("lowStock", data);
  io.to("admin").emit("lowStock", data);
  console.log("Low stock alert emitted:", data);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
const salesRoutes = require("./routes/sales");
const inventoryRoutes = require("./routes/inventory");
const suppliersRoutes = require("./routes/suppliers");
const purchaseOrderRoutes = require("./routes/purchaseOrders");
const ordersRoutes = require("./routes/orders");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/orders", ordersRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to Jungle Safari Inventory Management API");
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://test-yt:2QLGZiCAG0mkLhRS@cluster0.qyubw.mongodb.net/jungle_safari_inventory";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

module.exports = app;
