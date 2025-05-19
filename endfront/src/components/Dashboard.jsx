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
        console.log('Fetching analytics data for dashboard...');

        // First try to fetch leads data to calculate active leads count
        let activeLeadsCount = 0;
        try {
          const token = localStorage.getItem('token');
          const leadsResponse = await fetch('http://localhost:3000/api/leads', {
            headers: token ? {
              'Authorization': `Bearer ${token}`
            } : {}
          });

          if (leadsResponse.status === 404) {
            // If the API endpoint is not found, use mock data
            console.log('API endpoint not found, using mock data for leads count');
            // Count mock leads (Cold + Warm + Hot)
            activeLeadsCount = 4; // 2 Cold + 1 Warm + 1 Hot from mock data
          } else if (leadsResponse.ok) {
            const leadsData = await leadsResponse.json();

            // Handle different response formats (array or object with leads property)
            const leadsArray = Array.isArray(leadsData) ? leadsData : (leadsData.leads || []);

            // Count active leads (all leads except 'cooked')
            activeLeadsCount = leadsArray.filter(lead =>
              lead && lead.status && lead.status !== 'cooked'
            ).length;

            console.log('Active leads count from API:', activeLeadsCount);
          }
        } catch (leadsError) {
          console.error('Error fetching leads for active count:', leadsError);
        }

        try {
          // Add a timestamp to prevent caching
          const timestamp = new Date().getTime();
          const response = await fetch(`/api/analytics/dashboard?t=${timestamp}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Dashboard analytics data received:', data);

          setAnalytics({
            totalSales: data.totalSales || 0,
            conversionRate: data.conversionRate || 0,
            // Use our calculated active leads count instead of API value
            activeLeads: activeLeadsCount
          });
        } catch (apiError) {
          console.error('Error fetching analytics from API:', apiError);
          // Use the leads count we calculated and fallback values for other metrics
          setAnalytics({
            totalSales: 1000, // Fallback value
            conversionRate: 20, // Fallback value
            activeLeads: activeLeadsCount
          });
        }
      } catch (error) {
        console.error('Error in overall analytics fetch process:', error);
        // Set default values on error
        setAnalytics({
          totalSales: 1000,
          conversionRate: 20,
          activeLeads: 4 // Default mock data count
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);


  const handleLogout = () => {
    // Use the logout function from AuthContext to properly clear all auth data
    authLogout();
    setUsername(null);
    navigate('/');
  };


  return (

    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sales Pipeline System</h1>
        <div className="header-controls">
          {username ? (
            <div className="user-controls">
              <span className="welcome-message">Welcome, {username.name}</span>
            </div>
          ) : (
            <Navigate to="/" />
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
                  <div className="value">₱{analytics.totalSales.toLocaleString()}</div>
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
      </div>
    </div>
  );
};

export default Dashboard;
