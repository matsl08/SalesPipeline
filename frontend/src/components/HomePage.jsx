import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { initNavbarScrollEffect, initCardHoverEffects } from '../utils/animations';
import logo from '../assets/1.jpg';

const HomePage = () => {
  useEffect(() => {
    // Initialize navbar scroll effect
    const cleanupNavbar = initNavbarScrollEffect();

    // Initialize card hover effects
    const cleanupCards = initCardHoverEffects('.feature-card');

    // Cleanup on component unmount
    return () => {
      cleanupNavbar();
      cleanupCards();
    };
  }, []);

  return (
    <div className="home-container">
      <nav className="nav-bar">
        <div className="logo-container">
          <img
            src={logo}
            alt="Sales Pipeline Logo"
            className="logo"
          />
          <span className="logo-text">Sales Pipeline System</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Sign In</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-title">Transform Your Sales Process</h1>
        <p className="hero-subtitle">
          Streamline your pipeline, boost conversions, and grow your business
        </p>
        <Link to="/signup" className="cta-button">Get Started</Link>
      </section>

      <section className="features-section">
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">Everything you need to manage your sales process effectively</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h2 className="feature-title">Lead Management</h2>
            <p className="feature-description">
              Efficiently track and manage your leads from first contact to close. Never miss a follow-up again.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h2 className="feature-title">Pipeline Analytics</h2>
            <p className="feature-description">
              Get real-time insights into your sales pipeline performance with beautiful, actionable dashboards.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h2 className="feature-title">Team Collaboration</h2>
            <p className="feature-description">
              Work seamlessly with your team to close more deals. Share notes, assign tasks, and track progress.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;