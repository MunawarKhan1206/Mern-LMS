import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await API.get("/enrollment/my-courses");
      setEnrollments(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load your courses. Please check your connection and try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading your courses...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📚 My Enrolled Courses</h1>
        <p>Track your learning progress here</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {enrollments.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't enrolled in any courses yet</h3>
          <p>Browse our course catalog and start learning!</p>
          <Link to="/courses" className="btn btn-primary">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="courses-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="course-card">
              <div className="course-card-header">
                <span className="course-category">
                  {enrollment.course?.category}
                </span>
                <span className="course-price">
                  {enrollment.course?.price === 0
                    ? "Free"
                    : `$${enrollment.course?.price}`}
                </span>
              </div>
              <h3 className="course-title">{enrollment.course?.title}</h3>
              <p className="course-description">
                {enrollment.course?.description?.substring(0, 80)}...
              </p>
              <div className="progress-section">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${enrollment.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{enrollment.progress}% complete</span>
              </div>
              <div className="course-card-footer">
                <span className="course-instructor">
                  By {enrollment.course?.instructor?.name || "Unknown"}
                </span>
              </div>
              <Link
                to={`/courses/${enrollment.course?._id}`}
                className="btn btn-primary btn-small"
              >
                Continue Learning
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
