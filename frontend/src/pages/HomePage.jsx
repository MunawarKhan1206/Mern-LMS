import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* hero section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to LMS</h1>
          <p className="hero-subtitle">
            Your one-stop platform for quality online learning. Browse courses
            from expert instructors and level up your skills today.
          </p>
          <div className="hero-buttons">
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* features section */}
      <section className="features-section">
        <h2>Why Choose LMS?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Expert Instructors</h3>
            <p>Learn from industry professionals who have real-world experience in their fields.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Quality Content</h3>
            <p>Well-structured courses with lessons designed for effective learning at your pace.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💻</div>
            <h3>Learn Anywhere</h3>
            <p>Access your courses from any device, anytime. Learning has no boundaries.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey with progress tracking on every enrolled course.</p>
          </div>
        </div>
      </section>

      {/* cta section */}
      <section className="cta-section">
        <h2>Ready to Start Learning?</h2>
        <p>Join thousands of students already learning on LMS.</p>
        <Link to="/register" className="btn btn-primary">
          Sign Up Now
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
