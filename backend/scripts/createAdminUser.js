const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: "abhishek2265@gmail.com" });

        if (!existingAdmin) {
            const adminUser = new User({
                name: "Abhishek Admin",
                email: "abhishek2265@gmail.com",
                password: "654321",
                role: "admin",
                phone: "1234567890"
            });
            await adminUser.save();
            console.log("Admin user created successfully!");
        } else {
            console.log("Admin user already exists");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();