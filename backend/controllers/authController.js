const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists. Please use a different email or try logging in." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Developer-friendly error log with full context
    console.error("=== REGISTER ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: POST /api/auth/register");
    console.error("Request Body (email):", req.body?.email || "missing");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.code === 11000) {
      console.error("Duplicate Key Error - Field:", Object.keys(error.keyPattern || {}));
      return res.status(400).json({ message: "An account with this email already exists." });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      console.error("Validation Errors:", messages);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Stack Trace:", error.stack);
    console.error("=== END REGISTER ERROR ===");
    res.status(500).json({ message: "Registration failed due to a server error. Please try again later." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter both email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No account found with this email. Please check your email or register a new account." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Please try again." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Developer-friendly error log with full context
    console.error("=== LOGIN ERROR ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Endpoint: POST /api/auth/login");
    console.error("Request Body (email):", req.body?.email || "missing");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Stack Trace:", error.stack);
    console.error("=== END LOGIN ERROR ===");
    res.status(500).json({ message: "Login failed due to a server error. Please try again later." });
  }
};

module.exports = { registerUser, loginUser };
