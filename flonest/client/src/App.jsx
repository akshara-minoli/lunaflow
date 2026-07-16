import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

// Wrapper: public pages get Navbar + Footer
const PublicPage = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes — wrapped in public Layout (Navbar + Footer) */}
            <Route path="/" element={<PublicPage><Welcome /></PublicPage>} />
            <Route path="/login" element={<PublicPage><Login /></PublicPage>} />
            <Route path="/register" element={<PublicPage><Register /></PublicPage>} />
            <Route path="/forgot-password" element={<PublicPage><ForgotPassword /></PublicPage>} />
            <Route path="/reset-password/:token" element={<PublicPage><ResetPassword /></PublicPage>} />

            {/* Protected dashboard — uses its own DashboardLayout (Sidebar + Topbar) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
