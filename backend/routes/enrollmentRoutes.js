const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
} = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

// student routes - must be logged in
router.post("/enroll", protect, authorize("student"), enrollInCourse);
router.get("/my-courses", protect, authorize("student"), getMyCourses);

module.exports = router;
