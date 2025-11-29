import '../css/About.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Your trusted online bookstore since 2025</p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            We started with a simple mission: to make quality books accessible to everyone.
            Our online bookstore brings together thousands of titles from various genres,
            ensuring that every reader finds something they love.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            To inspire a love for reading by providing an easy-to-use platform where book
            lovers can discover, purchase, and enjoy their favorite books. We believe in
            the power of stories to transform lives and build communities.
          </p>
        </div>

        <div className="about-section">
          <h2>What We Offer</h2>
          <ul>
            <li>Extensive collection of books across all genres</li>
            <li>Competitive prices and special deals</li>
            <li>Easy search and browse functionality</li>
            <li>Secure and simple checkout process</li>
            <li>Fast and reliable delivery</li>
            <li>Customer support for all your queries</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Contact Information</h2>
          <p>Email: info@onlinebookstore.com</p>
          <p>Phone: +961 123 456</p>
          <p>Address: Beirut, Lebanon</p>
        </div>
      </div>
    </div>
  );
}

export default About;
