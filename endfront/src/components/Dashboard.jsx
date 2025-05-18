import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnalyticsDashboard from './AnalyticsDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser)  : null;
  });
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
  };
  const handleLogout = () => {
    // Use the logout function from AuthContext to properly clear all auth data
    authLogout();
    setUsername(null);
    navigate('/login');
  };


  return (

    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Enhanced Sales Pipeline System</h1>
        <div className="header-controls">
          {username ? (
            <div className="user-controls">
              <span className="welcome-message">Welcome, {username.name}</span>
            </div>
          ) : (
            <Navigate to="/login" />
          )}
          <nav className="auth-nav">
            <Link to="/dashboard"><button className="nav-link active">Dashboard</button></Link>
            <Link to="/pipeline"><button className="nav-link">Pipeline</button></Link>
            <Link to="/interactions"><button className="nav-link">Interactions</button></Link>
            <button className="nav-link" onClick={handleLogout}>Log Out</button>
          </nav>
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
                  <div className="value">{analytics.totalSales.toLocaleString()}</div>
                </div>
                <div className="analytics-card">
                  <h3>Conversion Rate</h3>
                  <div className="value">{analytics.conversionRate.toFixed(1)}%</div>
                </div>
                <div className="analytics-card">
                  <h3>Active Leads</h3>
                  <div className="value">{analytics.activeLeads}</div>
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
  );
};

export default Dashboard;
