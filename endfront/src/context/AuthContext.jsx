import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (userData, token) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error during login in AuthContext:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);