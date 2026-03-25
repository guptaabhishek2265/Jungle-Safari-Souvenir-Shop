const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const createTestUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if users already exist
        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        const existingSales = await User.findOne({ email: "sales@example.com" });
        const existingInventory = await User.findOne({ email: "inventory@example.com" });

        // Create admin user if doesn't exist
        if (!existingAdmin) {
            const adminUser = new User({
                name: "Admin User",
                email: "admin@example.com",
                password: "password",
                role: "admin",
                phone: "1234567890"
            });
            await adminUser.save();
            console.log("Admin user created");
        } else {
            console.log("Admin user already exists");
        }

        // Create sales user if doesn't exist
        if (!existingSales) {
            const salesUser = new User({
                name: "Sales User",
                email: "sales@example.com",
                password: "password",
                role: "sales",
                phone: "1234567891"
            });
            await salesUser.save();
            console.log("Sales user created");
        } else {
            console.log("Sales user already exists");
        }

        // Create inventory manager if doesn't exist
        if (!existingInventory) {
            const inventoryUser = new User({
                name: "Inventory Manager",
                email: "inventory@example.com",
                password: "password",
                role: "inventory_manager",
                phone: "1234567892"
            });
            await inventoryUser.save();
            console.log("Inventory manager created");
        } else {
            console.log("Inventory manager already exists");
        }

        console.log("Test users setup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error creating test users:", error);
        process.exit(1);
    }
};

createTestUsers();