import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ManageCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await API.get("/courses");
      // filter to only show this instructors courses
      const myCourses = response.data.filter(
        (course) => course.instructor?._id === user._id
      );
      setCourses(myCourses);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load your courses. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
    } catch (err) {
      setError(err.userMessage || "Unable to delete this course. Please try again.");
    }
  };

  const startEditing = (course) => {
    setEditingCourse(course._id);
    setEditForm({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
    });
  };

  const cancelEditing = () => {
    setEditingCourse(null);
    setEditForm({ title: "", description: "", category: "", price: 0 });
  };

  const handleUpdate = async (courseId) => {
    try {
      const response = await API.put(`/courses/${courseId}`, editForm);
      setCourses(
        courses.map((c) => (c._id === courseId ? response.data : c))
      );
      setEditingCourse(null);
    } catch (err) {
      setError(err.userMessage || "Unable to update this course. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading your courses...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📋 Manage My Courses</h1>
        <Link to="/instructor/create-course" className="btn btn-primary">
          + Create New Course
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't created any courses yet</h3>
          <p>Start by creating your first course!</p>
          <Link to="/instructor/create-course" className="btn btn-primary">
            Create Course
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Lessons</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  {editingCourse === course._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({ ...editForm, category: e.target.value })
                          }
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                          className="edit-input"
                        />
                      </td>
                      <td>{course.lessons?.length || 0}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleUpdate(course._id)}
                          className="btn btn-success btn-small"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="btn btn-secondary btn-small"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>{course.price === 0 ? "Free" : `$${course.price}`}</td>
                      <td>{course.lessons?.length || 0}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => startEditing(course)}
                          className="btn btn-warning btn-small"
                        >
                          Edit
                        </button>
                        <Link
                          to={`/instructor/upload-lessons/${course._id}`}
                          className="btn btn-primary btn-small"
                        >
                          Add Lesson
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="btn btn-danger btn-small"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
