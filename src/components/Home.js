import '../css/Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Our Online Bookstore</h1>
        <p>Discover your next favorite book from our curated collection</p>
        <div className="hero-buttons">
          <Link to="/books" className="btn-primary">Browse Books</Link>
          <Link to="/about" className="btn-secondary">Learn More</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 Wide Selection</h3>
            <p>Browse through our extensive collection of books across all genres</p>
          </div>
          <div className="feature-card">
            <h3>💰 Best Prices</h3>
            <p>Get the best deals on your favorite books</p>
          </div>
          <div className="feature-card">
            <h3>🚚 Fast Delivery</h3>
            <p>Quick and reliable shipping to your doorstep</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Secure Payment</h3>
            <p>Safe and secure checkout process</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Start Your Reading Journey Today</h2>
        <p>Join thousands of happy readers</p>
        <Link to="/books" className="btn-cta">Explore Books</Link>
      </div>
    </div>
  );
}

export default Home;
