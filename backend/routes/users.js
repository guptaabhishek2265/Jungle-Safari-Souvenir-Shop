const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Placeholder - will be implemented later
router.get("/", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Users route - to be implemented" });
});

module.exports = router;
