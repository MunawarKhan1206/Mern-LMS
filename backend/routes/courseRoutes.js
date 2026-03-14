const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

// public routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// protected routes - instructor and admin
router.post("/", protect, authorize("instructor", "admin"), createCourse);
router.put("/:id", protect, authorize("instructor", "admin"), updateCourse);
router.delete("/:id", protect, authorize("instructor", "admin"), deleteCourse);

// add lesson to course - instructor only
router.post("/:id/lessons", protect, authorize("instructor"), addLesson);

module.exports = router;
