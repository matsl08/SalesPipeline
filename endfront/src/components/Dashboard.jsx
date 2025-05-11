// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LeadManagement from './LeadManagement';
import InteractionHistory from './InteractionHistory';
import AnalyticsDashboard from './AnalyticsDashboard';
import ReportingTools from './ReportingTools';
import Login from './Login';
import SignUp from './SignUp';
import './Dashboard.css'; // Custom CSS styles

function App() {
  const [username, setUsername] = useState(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      // You are logged in
    }
  }, [username]);

  const handleLogin = (username) => {
    setUsername(username);
    localStorage.setItem('user', username);
    navigate('/');
  };

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header>
        <h1>Enhanced Sales Pipeline System</h1>
        {username ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <nav>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main>
        <Routes>
         <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

          {username && (
            <Route
              path="/"
              element={
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="dashboard-section">
                    <h2>Lead Management</h2>
                    <LeadManagement />
                  </div>

                  <div className="dashboard-section">
                    <h2>Interaction History</h2>
                    <InteractionHistory leadName="John Doe" />
                  </div>

                  <div className="dashboard-section">
                    <h2>Analytics Dashboard</h2>
                    <AnalyticsDashboard />
                  </div>

                  <div className="dashboard-section">
                    <h2>Reporting Tools</h2>
                    <ReportingTools />
                  </div>
                </div>
              }
            />
          )}

          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
