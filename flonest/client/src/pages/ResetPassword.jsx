import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.svg';

const ResetPassword = () => {
  const { token } = useParams();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        // Reset password logs user in automatically; navigate to dashboard
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative">
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-rose-500/10 blur-[100px] -z-10" />

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl">
        
        {/* Branding header */}
        <div className="text-center space-y-3 mb-8">
          <img src={logo} alt="FloNest Logo" className="w-12 h-12 mx-auto hover:rotate-6 transition-transform duration-350" />
          <h2 className="font-outfit font-bold text-3xl text-white">New Password</h2>
          <p className="text-slate-400 text-sm">
            Enter and verify your new account credentials.
          </p>
        </div>

        {/* Display Errors */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input font-medium text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none p-0.5"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input font-medium text-sm"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all duration-300 btn-glow flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Save & Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-slate-400">
          Remember your password?{' '}
          <Link to="/login" className="text-rose-400 hover:text-rose-350 font-semibold transition-colors">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
