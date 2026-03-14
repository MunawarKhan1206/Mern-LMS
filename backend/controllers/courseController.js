const Course = require("../models/Course");

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    console.error("=== GET COURSES ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: GET /api/courses");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END GET COURSES ERROR ===");
    res.status(500).json({ message: "Unable to load courses right now. Please try again later." });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "This course does not exist or has been removed." });
    }

    res.json(course);
  } catch (error) {
    console.error("=== GET COURSE BY ID ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: GET /api/courses/" + req.params.id);
    console.error("Error:", error.message);
    if (error.name === "CastError") {
      console.error("Invalid Course ID format:", req.params.id);
      return res.status(400).json({ message: "Invalid course link. Please check the URL and try again." });
    }
    console.error("Stack:", error.stack);
    console.error("=== END GET COURSE BY ID ERROR ===");
    res.status(500).json({ message: "Unable to load course details. Please try again later." });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, lessons } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please fill in the course title, description, and category." });
    }

    const course = await Course.create({
      title,
      description,
      category,
      price: price || 0,
      lessons: lessons || [],
      instructor: req.user._id,
    });

    const populatedCourse = await course.populate("instructor", "name email");

    res.status(201).json(populatedCourse);
  } catch (error) {
    console.error("=== CREATE COURSE ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: POST /api/courses");
    console.error("Instructor ID:", req.user?._id);
    console.error("Request Body:", JSON.stringify(req.body, null, 2));
    console.error("Error Name:", error.name);
    console.error("Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      console.error("Validation Errors:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Stack:", error.stack);
    console.error("=== END CREATE COURSE ERROR ===");
    res.status(500).json({ message: "Failed to create the course. Please try again later." });
  }
};

const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "This course does not exist or has been removed." });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You can only edit courses that you created." });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("instructor", "name email");

    res.json(course);
  } catch (error) {
    console.error("=== UPDATE COURSE ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: PUT /api/courses/" + req.params.id);
    console.error("User ID:", req.user?._id, "| Role:", req.user?.role);
    console.error("Update Body:", JSON.stringify(req.body, null, 2));
    console.error("Error Name:", error.name);
    console.error("Error:", error.message);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      console.error("Validation Errors:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Stack:", error.stack);
    console.error("=== END UPDATE COURSE ERROR ===");
    res.status(500).json({ message: "Failed to update the course. Please try again later." });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "This course does not exist or has already been removed." });
    }

    if (
      course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "You can only delete courses that you created." });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("=== DELETE COURSE ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: DELETE /api/courses/" + req.params.id);
    console.error("User ID:", req.user?._id, "| Role:", req.user?.role);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END DELETE COURSE ERROR ===");
    res.status(500).json({ message: "Failed to delete the course. Please try again later." });
  }
};

// @desc    Add a lesson to a course
// @route   POST /api/courses/:id/lessons
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "This course does not exist or has been removed." });
    }

    // only the instructor who owns this course can add lessons
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the course instructor can add lessons to this course." });
    }

    const { title, content, duration } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please provide both a lesson title and content." });
    }

    course.lessons.push({ title, content, duration });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    console.error("=== ADD LESSON ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: POST /api/courses/" + req.params.id + "/lessons");
    console.error("User ID:", req.user?._id);
    console.error("Lesson Data:", JSON.stringify(req.body, null, 2));
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END ADD LESSON ERROR ===");
    res.status(500).json({ message: "Failed to add the lesson. Please try again later." });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLesson,
};
