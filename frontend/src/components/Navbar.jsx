import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📚 LMS 
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/courses" className="nav-link">Courses</Link>

          {!user ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-nav">Register</Link>
            </>
          ) : (
            <>
              
              {user.role === "student" && (
                <Link to="/student/my-courses" className="nav-link">My Courses</Link>
              )}
              {user.role === "instructor" && (
                <Link to="/instructor/manage-courses" className="nav-link">My Dashboard</Link>
              )}
              {user.role === "admin" && (
                <Link to="/admin/manage-users" className="nav-link">Admin Panel</Link>
              )}

              <span className="nav-user-name">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
