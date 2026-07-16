import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.svg';

const Login = () => {
  const { login, error, clearError, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  // Clear global auth errors and handle redirect if already logged in
  useEffect(() => {
    clearError();
    setLocalError('');
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative">
      {/* Background ambient light */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-rose-500/10 blur-[100px] -z-10" />

      <div className="relative w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl">
        <Link
          to="/"
          aria-label="Back to welcome page"
          title="Back to welcome page"
          className="absolute top-5 left-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        
        {/* Branding header */}
        <div className="text-center space-y-3 mb-8">
          <Link to="/" className="inline-block">
            <img src={logo} alt="FloNest Logo" className="w-12 h-12 mx-auto hover:rotate-6 transition-transform duration-350" />
          </Link>
          <h2 className="font-outfit font-bold text-3xl text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm">
            Sign in to continue tracking your logs
          </p>
        </div>

        {/* Display Errors */}
        {(localError || error) && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input font-medium text-sm"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-rose-400 hover:text-rose-350 text-xs font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all duration-300 btn-glow flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Navigation back helper */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-rose-400 hover:text-rose-350 font-semibold transition-colors">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
