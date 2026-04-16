import "./About.css";
const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About Our Platform</h1>
        <p>Learning made simple, practical, and accessible.</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            We built this platform with a simple idea in mind — learning should
            be straightforward and available to anyone who wants to improve their
            skills. Whether you're just starting out or looking to grow, this
            platform is designed to help you move forward at your own pace.
          </p>
        </section>

        <section className="about-section">
          <h2>What You Can Do Here</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>📚 Learn</h3>
              <p>
                Explore courses across different topics and start learning
                instantly. No complicated setup — just pick a course and begin.
              </p>
            </div>

            <div className="about-card">
              <h3>🧑‍🏫 Teach</h3>
              <p>
                Share your knowledge by creating courses. Add lessons, organize
                content, and reach learners who are interested in your expertise.
              </p>
            </div>

            <div className="about-card">
              <h3>⚙️ Manage</h3>
              <p>
                Keep everything organized with built-in tools for managing users,
                courses, and overall platform activity.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why This Platform</h2>
          <p>
            There are plenty of learning platforms out there, but many are either
            too complex or overloaded. This one focuses on what actually matters:
            clean design, easy navigation, and a smooth learning experience.
          </p>
        </section>

        <section className="about-section">
          <h2>Built With</h2>
          <div className="tech-stack">
            <span className="tech-badge">MongoDB</span>
            <span className="tech-badge">Express</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Node.js</span>
            <span className="tech-badge">JWT Auth</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;