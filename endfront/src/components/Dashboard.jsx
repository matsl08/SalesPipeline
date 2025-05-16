// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
// import Pipeline from './Pipeline';
// import InteractionHistory from './InteractionHistory';
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
   const [analytics, setAnalytics] = useState({
    totalSales: 0,
    conversionRate: 0,
    activeLeads: 0
  });
const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/analytics/dashboard');
        const data = await response.json();
        setAnalytics({
          totalSales: data.totalSales || 0,
          conversionRate: data.conversionRate || 0,
          activeLeads: data.activeLeads || 0
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleViewAnalytics = () => {
    navigate('/analytics');
  }

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
              <Link to="/interactions" className="nav-link">Interactions</Link>
              <Link to="/" className="nav-link">Log Out</Link>
            </nav>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Analytics Overview</h2>
          <div className="analytics-container">
              {isLoading ? (
              <div className="loading">Loading analytics...</div>
                  ) : (
              <>
                <div className="analytics-card">
                    <h3>Total Sales</h3>
                    <div className="value">1000</div>
                </div>
                <div className="analytics-card">
                    <h3>Conversion Rate</h3>
                <div className="value">20%</div>
                </div>
                <div className="analytics-card">
                    <h3>Active Leads</h3>
                <div className="value">200</div>
                </div>
              </>

          )}
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
              <button className="action-btn" onClick={handleViewAnalytics}>View Analysis</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );{analytics.conversionRate.toFixed(1)}
};

// {analytics.activeLeads}
export default Dashboard;
// ${analytics.totalSales.toLocaleString()}