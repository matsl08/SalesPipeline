import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <nav className="nav-bar">
        <div className="logo-container">
          <img 
            src="/logo.svg" 
            alt="Sales Pipeline Logo" 
            className="logo"
          />
          <span className="logo-text">SalesPipeline</span>
        </div>
        <div className="nav-links">
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-title">Transform Your Sales Process</h1>
        <p className="hero-subtitle">
          Streamline your pipeline, boost conversions, and grow your business
        </p>
        <Link to="/signup" className="cta-button">Get Started Free</Link>
      </section>

      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <h2 className="feature-title">Lead Management</h2>
            <p className="feature-description">
              Efficiently track and manage your leads from first contact to close
            </p>
          </div>
          <div className="feature-card">
            <h2 className="feature-title">Pipeline Analytics</h2>
            <p className="feature-description">
              Get real-time insights into your sales pipeline performance
            </p>
          </div>
          <div className="feature-card">
            <h2 className="feature-title">Team Collaboration</h2>
            <p className="feature-description">
              Work seamlessly with your team to close more deals
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;