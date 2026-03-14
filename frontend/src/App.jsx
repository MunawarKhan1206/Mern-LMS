import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// student pages
import MyCourses from "./pages/student/MyCourses";
import ProfilePage from "./pages/student/ProfilePage";

// instructor pages
import CreateCourse from "./pages/instructor/CreateCourse";
import ManageCourses from "./pages/instructor/ManageCourses";
import UploadLessons from "./pages/instructor/UploadLessons";

// admin pages
import ManageUsers from "./pages/admin/ManageUsers";
import AdminManageCourses from "./pages/admin/AdminManageCourses";
import Reports from "./pages/admin/Reports";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* student routes */}
              <Route
                path="/student/my-courses"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <MyCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={["student", "instructor", "admin"]}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* instructor routes */}
              <Route
                path="/instructor/create-course"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <CreateCourse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/manage-courses"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <ManageCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/upload-lessons/:courseId"
                element={
                  <ProtectedRoute allowedRoles={["instructor"]}>
                    <UploadLessons />
                  </ProtectedRoute>
                }
              />

              {/* admin routes */}
              <Route
                path="/admin/manage-users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/manage-courses"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminManageCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Reports />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; 2026 LMS For HP. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
