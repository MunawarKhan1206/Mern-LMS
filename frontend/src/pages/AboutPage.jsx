const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About LMS </h1>
        <p>Empowering learners worldwide with quality education</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            LMS  is a modern Learning Management System built to bridge the
            gap between quality education and accessibility. We believe that
            everyone deserves access to great learning materials, regardless of
            their location or background.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>📚 For Students</h3>
              <p>
                Browse and enroll in courses across various categories. Track
                your learning progress and access course content anytime.
              </p>
            </div>
            <div className="about-card">
              <h3>👨‍🏫 For Instructors</h3>
              <p>
                Create and manage your own courses. Upload lessons, set pricing,
                and reach students from around the world.
              </p>
            </div>
            <div className="about-card">
              <h3>🛡️ For Administrators</h3>
              <p>
                Full control over the platform. Manage users, oversee courses,
                and view analytics to keep everything running smoothly.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">Express.js</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">JWT Auth</span>
            <span className="tech-badge">REST API</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
