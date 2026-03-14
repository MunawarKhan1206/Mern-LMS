import { useState, useEffect } from "react";
import API from "../../services/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // state for add instructor form
  const [showForm, setShowForm] = useState(false);
  const [instructorName, setInstructorName] = useState("");
  const [instructorEmail, setInstructorEmail] = useState("");
  const [instructorPassword, setInstructorPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.userMessage || "Unable to load users. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.userMessage || err.response?.data?.message || "Unable to delete user. Please try again.");
    }
  };

  // handle adding a new instructor
  const handleAddInstructor = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    try {
      const response = await API.post("/users/create-instructor", {
        name: instructorName,
        email: instructorEmail,
        password: instructorPassword,
      });

      setFormSuccess(`Instructor "${response.data.name}" created successfully!`);
      setInstructorName("");
      setInstructorEmail("");
      setInstructorPassword("");

      // refresh user list
      fetchUsers();
    } catch (err) {
      setFormError(err.userMessage || err.response?.data?.message || "Unable to create instructor. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading users...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>👥 Manage Users</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Instructor"}
        </button>
      </div>

      {/* add instructor form */}
      {showForm && (
        <div className="form-container" style={{ marginBottom: "24px" }}>
          <h3>Add New Instructor</h3>

          {formError && <div className="error-message">{formError}</div>}
          {formSuccess && <div className="success-message">{formSuccess}</div>}

          <form onSubmit={handleAddInstructor} className="course-form">
            <div className="form-group">
              <label htmlFor="instName">Full Name</label>
              <input
                type="text"
                id="instName"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                placeholder="Instructor's full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="instEmail">Email Address</label>
                <input
                  type="email"
                  id="instEmail"
                  value={instructorEmail}
                  onChange={(e) => setInstructorEmail(e.target.value)}
                  placeholder="instructor@email.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="instPassword">Password</label>
                <input
                  type="password"
                  id="instPassword"
                  value={instructorPassword}
                  onChange={(e) => setInstructorPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? "Creating..." : "Create Instructor Account"}
            </button>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem._id}>
                <td>{userItem.name}</td>
                <td>{userItem.email}</td>
                <td>
                  <span className={`role-badge role-${userItem.role}`}>
                    {userItem.role}
                  </span>
                </td>
                <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(userItem._id)}
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
    </div>
  );
};

export default ManageUsers;
