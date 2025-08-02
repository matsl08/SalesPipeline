import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './components/HomePage';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Pipeline from './components/Pipeline';
import InteractionHistory from './components/InteractionHistory';
import ViewAnalytics from './components/ViewAnalytics';
import './App.css';
import salesPipelineLogo from './assets/1.jpg';

<img src={salesPipelineLogo} alt="salesPipelineLogo" />

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading application...</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/signup" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <SignUp />
        } />
        
        {/* Routes that were previously protected */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/interactions" element={<InteractionHistory />} />
        <Route path="/analytics" element={<ViewAnalytics />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;