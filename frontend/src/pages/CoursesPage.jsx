import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await API.get("/courses");
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load courses. Please check your connection and try again.");
      setLoading(false);
    }
  };

  // filter courses based on search
  const filteredCourses = courses.filter((course) => {
    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="loading-screen">Loading courses...</div>;
  }

  return (
    <div className="courses-page">
      <div className="page-header">
        <h1>All Courses</h1>
        <p>Browse through our collection of courses</p>
      </div>

      {/* search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search courses by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredCourses.length === 0 ? (
        <div className="no-results">
          <p>No courses found. Check back later!</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-card-header">
                <span className="course-category">{course.category}</span>
                <span className="course-price">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
              </div>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">
                {course.description.length > 100
                  ? course.description.substring(0, 100) + "..."
                  : course.description}
              </p>
              <div className="course-card-footer">
                <span className="course-instructor">
                  By {course.instructor?.name || "Unknown"}
                </span>
                <span className="course-lessons">
                  {course.lessons?.length || 0} lessons
                </span>
              </div>
              <Link to={`/courses/${course._id}`} className="btn btn-primary btn-small">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
