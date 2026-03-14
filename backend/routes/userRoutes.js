const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getUserProfile,
  getAnalytics,
  createInstructor,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// get own profile - any logged in user
router.get("/profile", protect, getUserProfile);

// admin only routes
router.get("/analytics", protect, authorize("admin"), getAnalytics);
router.get("/", protect, authorize("admin"), getAllUsers);
router.post("/create-instructor", protect, authorize("admin"), createInstructor);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;

