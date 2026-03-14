const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Please select a course to enroll in." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "This course does not exist or has been removed." });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "You are already enrolled in this course." });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json({
      message: "Enrolled successfully! You can now access the course.",
      enrollment,
    });
  } catch (error) {
    console.error("=== ENROLLMENT ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: POST /api/enrollment/enroll");
    console.error("Student ID:", req.user?._id);
    console.error("Course ID:", req.body?.courseId);
    console.error("Error Name:", error.name);
    console.error("Error:", error.message);
    if (error.name === "CastError") {
      console.error("Invalid Course ID format:", req.body?.courseId);
      return res.status(400).json({ message: "Invalid course selected. Please try again." });
    }
    console.error("Stack:", error.stack);
    console.error("=== END ENROLLMENT ERROR ===");
    res.status(500).json({ message: "Unable to enroll in this course right now. Please try again later." });
  }
};

// @desc    Get courses the student is enrolled in
// @route   GET /api/enrollment/my-courses
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: "course",
        populate: {
          path: "instructor",
          select: "name email",
        },
      });

    res.json(enrollments);
  } catch (error) {
    console.error("=== GET MY COURSES ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: GET /api/enrollment/my-courses");
    console.error("Student ID:", req.user?._id);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END GET MY COURSES ERROR ===");
    res.status(500).json({ message: "Unable to load your enrolled courses. Please try again later." });
  }
};

module.exports = { enrollInCourse, getMyCourses };
