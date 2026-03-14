import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

const UploadLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    duration: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await API.get(`/courses/${courseId}`);
      setCourse(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load course. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setLessonData({
      ...lessonData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await API.post(
        `/courses/${courseId}/lessons`,
        lessonData
      );
      setCourse(response.data);
      setLessonData({ title: "", content: "", duration: "" });
      setSuccess("Lesson added successfully!");
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Unable to add lesson. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📝 Upload Lessons</h1>
        <p>
          Adding lessons to: <strong>{course?.title}</strong>
        </p>
      </div>

      {/* existing lessons */}
      <div className="existing-lessons">
        <h3>Current Lessons ({course?.lessons?.length || 0})</h3>
        {course?.lessons?.length > 0 ? (
          <div className="lessons-list">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="lesson-item">
                <div className="lesson-number">{index + 1}</div>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <p>{lesson.content.substring(0, 100)}...</p>
                  {lesson.duration && (
                    <span className="lesson-duration">⏱️ {lesson.duration}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No lessons yet. Add your first lesson below!</p>
        )}
      </div>

      {/* add new lesson form */}
      <div className="form-container">
        <h3>Add New Lesson</h3>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-group">
            <label htmlFor="title">Lesson Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={lessonData.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Variables"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Lesson Content</label>
            <textarea
              id="content"
              name="content"
              value={lessonData.content}
              onChange={handleChange}
              placeholder="Write the lesson content here..."
              rows="6"
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (optional)</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={lessonData.duration}
              onChange={handleChange}
              placeholder="e.g. 15 minutes"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Lesson
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/instructor/manage-courses")}
            >
              Back to My Courses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadLessons;
