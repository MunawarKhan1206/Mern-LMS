import { useState, useEffect } from "react";
import API from "../../services/api";

const Reports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await API.get("/users/analytics");
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load analytics data. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading analytics...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Reports & Analytics</h1>
        <p>Overview of the platform performance</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {analytics && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{analytics.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-info">
                <h3>{analytics.totalStudents}</h3>
                <p>Students</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👨‍🏫</div>
              <div className="stat-info">
                <h3>{analytics.totalInstructors}</h3>
                <p>Instructors</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{analytics.totalCourses}</h3>
                <p>Total Courses</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>{analytics.totalEnrollments}</h3>
                <p>Total Enrollments</p>
              </div>
            </div>
          </div>

          {/* recent users */}
          <div className="recent-section">
            <h2>Recent Users</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
