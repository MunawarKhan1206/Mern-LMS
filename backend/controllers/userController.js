const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("=== GET ALL USERS ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: GET /api/users");
    console.error("Admin ID:", req.user?._id);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END GET ALL USERS ERROR ===");
    res.status(500).json({ message: "Unable to load users right now. Please try again later." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "This user account was not found. It may have already been deleted." });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("=== DELETE USER ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: DELETE /api/users/" + req.params.id);
    console.error("Admin ID:", req.user?._id);
    console.error("Target User ID:", req.params.id);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END DELETE USER ERROR ===");
    res.status(500).json({ message: "Failed to delete user. Please try again later." });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Your profile was not found. Please log in again." });
    }
    res.json(user);
  } catch (error) {
    console.error("=== GET PROFILE ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: GET /api/users/profile");
    console.error("User ID:", req.user?._id);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END GET PROFILE ERROR ===");
    res.status(500).json({ message: "Unable to load your profile. Please try again later." });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
      recentUsers,
    });
  } catch (error) {
    console.error("=== ANALYTICS ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: GET /api/users/analytics");
    console.error("Admin ID:", req.user?._id);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=== END ANALYTICS ERROR ===");
    res.status(500).json({ message: "Unable to load analytics data. Please try again later." });
  }
};

const createInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in the instructor's name, email, and password." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists. Please use a different email." });
    }

    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const instructor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "instructor",
    });

    res.status(201).json({
      _id: instructor._id,
      name: instructor.name,
      email: instructor.email,
      role: instructor.role,
    });
  } catch (error) {
    console.error("=== CREATE INSTRUCTOR ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: POST /api/users/create-instructor");
    console.error("Admin ID:", req.user?._id);
    console.error("Instructor Email:", req.body?.email);
    console.error("Error Name:", error.name);
    console.error("Error:", error.message);
    if (error.code === 11000) {
      console.error("Duplicate Key Error - Field:", Object.keys(error.keyPattern || {}));
      return res.status(400).json({ message: "An account with this email already exists." });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      console.error("Validation Errors:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Stack:", error.stack);
    console.error("=== END CREATE INSTRUCTOR ERROR ===");
    res.status(500).json({ message: "Failed to create instructor account. Please try again later." });
  }
};

module.exports = { getAllUsers, deleteUser, getUserProfile, getAnalytics, createInstructor };
