import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount (reads from httpOnly cookie)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.data?.user) {
          setUser(res.data.data.user);
        }
      } catch (err) {
        // Safe to ignore: user is simply not logged in yet
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Register user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        setUser(res.data.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        setUser(res.data.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify your credentials.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout user (POST to clear cookie server-side)
  const logoutUser = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setUser(null); // Clear locally even on error
    } finally {
      setLoading(false);
    }
  };

  // Clear current error state
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register: registerUser,
        login: loginUser,
        logout: logoutUser,
        clearError,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
