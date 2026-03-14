import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrollMessage, setEnrollMessage] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await API.get(`/courses/${id}`);
      setCourse(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load course details. Please try again.");
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await API.post("/enrollment/enroll", { courseId: id });
      setEnrollMessage(response.data.message);
    } catch (err) {
      setEnrollMessage(
        err.userMessage || err.response?.data?.message || "Unable to enroll. Please try again."
      );
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading course details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found.</div>;
  }

  return (
    <div className="course-detail-page">
      <div className="course-detail-header">
        <div className="course-detail-info">
          <span className="course-category">{course.category}</span>
          <h1>{course.title}</h1>
          <p className="course-detail-description">{course.description}</p>
          <div className="course-meta">
            <span>👨‍🏫 Instructor: {course.instructor?.name || "Unknown"}</span>
            <span>📧 {course.instructor?.email || ""}</span>
            <span>📚 {course.lessons?.length || 0} Lessons</span>
            <span>
              💰 {course.price === 0 ? "Free" : `$${course.price}`}
            </span>
          </div>
        </div>

        {/* enroll button - only for students */}
        {user && user.role === "student" && (
          <div className="enroll-section">
            <button onClick={handleEnroll} className="btn btn-primary">
              Enroll in this Course
            </button>
            {enrollMessage && (
              <p className="enroll-message">{enrollMessage}</p>
            )}
          </div>
        )}

        {!user && (
          <div className="enroll-section">
            <button onClick={() => navigate("/login")} className="btn btn-primary">
              Login to Enroll
            </button>
          </div>
        )}
      </div>

      {/* lessons list */}
      <div className="lessons-section">
        <h2>Course Lessons</h2>
        {course.lessons && course.lessons.length > 0 ? (
          <div className="lessons-list">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="lesson-item">
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <p>{lesson.content}</p>
                  {lesson.duration && (
                    <span className="lesson-duration">⏱️ {lesson.duration}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-lessons">No lessons added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
