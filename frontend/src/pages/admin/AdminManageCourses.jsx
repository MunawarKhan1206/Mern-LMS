import { useState, useEffect } from "react";
import API from "../../services/api";

const AdminManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await API.get("/courses");
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load courses. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      setError(err.userMessage || "Unable to delete course. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading courses...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📚 Manage All Courses</h1>
        <p>Oversee all courses on the platform</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>No courses on the platform yet</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Instructor</th>
                <th>Price</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.instructor?.name || "Unknown"}</td>
                  <td>{course.price === 0 ? "Free" : `$${course.price}`}</td>
                  <td>{course.lessons?.length || 0}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManageCourses;
