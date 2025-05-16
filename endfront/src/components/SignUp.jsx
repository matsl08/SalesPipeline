import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    try {
      const response = await axios.post('http://localhost:3000/api/users/register', {
        username: formData.username,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <header className="dashboard-header">
        <h1>Enhanced Sales Pipeline System</h1>
        <nav className="auth-nav">
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </header>

      <div className="signup-form-container">
        <h2>Create your account</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
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
              type="password"
              required
              placeholder="Password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
            />
          </div>
          <p className="hasAccount">Already have an account? <Link to="/login">Login</Link></p>
          <button
            type="submit"
            disabled={loading}
            className="signup-button"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;