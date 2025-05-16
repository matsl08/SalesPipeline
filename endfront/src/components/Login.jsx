import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  // Clear any console errors on component mount
  useEffect(() => {
    console.clear();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    //  try {
    //    const response = await fetch('http://localhost:3000/api/login/:${formData.email}', {
    //      method: 'POST',
    //      headers: {
    //        'Content-Type': 'application/json',
    //      },
    //      body: JSON.stringify({
    //        email: formData.email.trim(),
    //        password: formData.password
    //      }),
    //    });
      
    //    const data = await response.json();
      
    //    if (!response.ok) {
    //      throw new Error(data.message || 'Login failed. Please check your credentials and try again.');
    //    }
      
    //    if (data && data.token && data.user) {
    //       // Store user info in localStorage
    //      localStorage.setItem('token', data.token);
    //      localStorage.setItem('user', JSON.stringify(data.user));
        
    //       // Update auth context
    //      auth.login(data.user, data.token);
        
    //     //  Navigate to dashboard
        navigate('/dashboard');
    //    } else {
    //      throw new Error('Invalid response format');
    //    }
    //  } catch (err) {
    //    console.error('Login error:', err);
    //    setError(err.message || 'Login failed. Please check your credentials and try again.');
    //  } finally {
    //    setLoading(false);
    // }
  };

  return (
    <div className="login-container">
      <header className="dashboard-header">
        <h1>Enhanced Sales Pipeline System</h1>
        <nav className="auth-nav">
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </nav>
      </header>

      <div className="login-form-container">
        <h2>Sign in to your account</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
            <div className="login-help">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          <p>Test account: test@example.com / password123</p>
        </div>
          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
      
      </div>
    </div>
  );
};

export default Login;