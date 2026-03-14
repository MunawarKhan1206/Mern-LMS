const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5000"
      ];
      
      const isAllowed = 
        allowedOrigins.includes(origin) || 
        origin.endsWith(".vercel.app") || 
        origin.includes("mern-lms"); // catch-all for custom domains if they match project name
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn("Blocked by CORS:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  })
);
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/enrollment", enrollmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LMS API is running..." });
});

app.use((err, req, res, next) => {
  console.error("=== UNHANDLED SERVER ERROR ===");
  console.error("Timestamp:", new Date().toISOString());
  console.error("Method:", req.method, "| URL:", req.originalUrl);
  console.error("User ID:", req.user?._id || "Not authenticated");
  console.error("Error Name:", err.name);
  console.error("Error Message:", err.message);
  console.error("Stack Trace:", err.stack);
  console.error("=== END UNHANDLED SERVER ERROR ===");
  res.status(500).json({ message: "Something went wrong on the server. Please try again later." });
});


const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@lms.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await User.create({
        name: "Admin",
        email: "admin@lms.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Default admin account created (admin@lms.com / admin123)");
    }
  } catch (error) {
    console.error("Could not create default admin:", error.message);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  createDefaultAdmin();
});
