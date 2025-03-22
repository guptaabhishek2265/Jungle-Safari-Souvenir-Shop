const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// Mock suppliers data for demo purposes
let suppliers = [
  {
    _id: "1",
    name: "Wilderness Outfitters",
    contactPerson: "John Smith",
    email: "john@wildernessoutfitters.com",
    phone: "555-123-4567",
    address: "123 Jungle Ave, Safari City",
    categories: ["Apparel", "Equipment", "Footwear"],
    notes: "Preferred supplier for hiking equipment.",
  },
  {
    _id: "2",
    name: "Safari Supplies Inc",
    contactPerson: "Jane Doe",
    email: "jane@safarisupplies.com",
    phone: "555-765-4321",
    address: "456 Wildlife Lane, Adventure Town",
    categories: ["Health", "Food", "Equipment"],
    notes: "Specializes in health and safety products.",
  },
  {
    _id: "3",
    name: "Jungle Gear Co.",
    contactPerson: "Robert Johnson",
    email: "robert@junglegear.com",
    phone: "555-987-6543",
    address: "789 Explorer Road, Trail City",
    categories: ["Apparel", "Equipment", "Accessories"],
    notes: "Known for durable, high-quality gear.",
  },
  {
    _id: "4",
    name: "Adventure Equipment Ltd",
    contactPerson: "Sarah Williams",
    email: "sarah@adventureequipment.com",
    phone: "555-234-5678",
    address: "101 Safari Street, Jungle Junction",
    categories: ["Equipment", "Books", "Maps"],
    notes: "Great for specialized equipment and educational materials.",
  },
];

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
router.get("/", protect, (req, res) => {
  res.json(suppliers);
});

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private
router.post("/", protect, (req, res) => {
  try {
    const { name, contactPerson, email, phone, address, categories, notes } =
      req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Please provide name, email, and phone",
      });
    }

    // Create a new supplier object
    const newSupplier = {
      _id: Date.now().toString(), // Generate a simple unique ID for the mock
      name,
      contactPerson,
      email,
      phone,
      address,
      categories,
      notes,
    };

    // Add to suppliers array
    suppliers.push(newSupplier);

    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error creating supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private
router.put("/:id", protect, (req, res) => {
  try {
    const supplierId = req.params.id;
    const { name, contactPerson, email, phone, address, categories, notes } =
      req.body;

    // Find the supplier
    const supplierIndex = suppliers.findIndex((s) => s._id === supplierId);

    if (supplierIndex === -1) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update supplier
    const updatedSupplier = {
      ...suppliers[supplierIndex],
      name: name || suppliers[supplierIndex].name,
      contactPerson: contactPerson || suppliers[supplierIndex].contactPerson,
      email: email || suppliers[supplierIndex].email,
      phone: phone || suppliers[supplierIndex].phone,
      address: address || suppliers[supplierIndex].address,
      categories: categories || suppliers[supplierIndex].categories,
      notes: notes || suppliers[supplierIndex].notes,
    };

    suppliers[supplierIndex] = updatedSupplier;

    res.json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
router.delete("/:id", protect, (req, res) => {
  try {
    const supplierId = req.params.id;

    // Find the supplier
    const supplierIndex = suppliers.findIndex((s) => s._id === supplierId);

    if (supplierIndex === -1) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Remove from array
    suppliers = suppliers.filter((s) => s._id !== supplierId);

    res.json({ message: "Supplier removed" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
