import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import LeadManagement from './LeadManagement';
import InteractionHistory from './InteractionHistory';
import AnalyticsDashboard from './AnalyticsDashboard';
import ReportingTools from './ReportingTools';
import './Dashboard.css';

const Dashboard = () => {
  const [currentLead, setCurrentLead] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Enhanced Sales Pipeline System</h1>
        <div className="header-controls">
          {username ? (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          ) : (
            <nav className="auth-nav">
              <Link to = "/dashboard" className="nav-link">Dashboard</Link>         
              <Link to="/pipeline" className="nav-link">Pipeline</Link>
              <Link to="/" className="nav-link">Log Out</Link>
            </nav>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Analytics Overview</h2>
          <div className="analytics-container">
            <div className="analytics-card">
              <h3>Total Sales</h3>
              <div className="value">$45,280</div>
            </div>
            <div className="analytics-card">
              <h3>Conversion Rate</h3>
              <div className="value">24.8%</div>
            </div>
            <div className="analytics-card">
              <h3>Active Leads</h3>
              <div className="value">128</div>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Sales Analytics</h2>
          <AnalyticsDashboard />
        </div>

        <div className="dashboard-section">
          <h2>Reporting Tools</h2>
          <div className="analytics-container">
            <div className="analytics-card">
              <h3>Monthly Report</h3>
              <p>Generate comprehensive monthly sales reports.</p>
              <button className="action-btn">Generate</button>
            </div>
            <div className="analytics-card">
              <h3>Performance Analysis</h3>
              <p>Analyze sales representative performance metrics.</p>
              <button className="action-btn">View Analysis</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;