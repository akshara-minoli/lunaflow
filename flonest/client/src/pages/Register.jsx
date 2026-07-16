import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Mail, Lock, User, Calendar, Clock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.svg';

const Register = () => {
  const { register, error, clearError, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cycleLength: 28,
    periodLength: 5
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cycleLength' || name === 'periodLength' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    const { name, email, password, cycleLength, periodLength } = formData;

    if (!name || !email || !password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    if (cycleLength < 15 || cycleLength > 45) {
      setLocalError('Cycle length must be between 15 and 45 days');
      return;
    }

    if (periodLength < 2 || periodLength > 15) {
      setLocalError('Period duration must be between 2 and 15 days');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative">
      {/* Background radial glow */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-rose-500/10 blur-[100px] -z-10" />

      <div className="relative w-full max-w-lg glass-panel p-8 md:p-10 rounded-3xl shadow-2xl">
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
          <h2 className="font-outfit font-bold text-3xl text-white">Create Account</h2>
          <p className="text-slate-400 text-sm">
            Join FloNest and start monitoring your wellness
          </p>
        </div>

        {/* Display errors */}
        {(localError || error) && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{localError || error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* User Name */}
          <div className="space-y-1.5">
            <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
              Your Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input font-medium text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input font-medium text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-350 text-xs font-semibold uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
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

          {/* Cycle Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Avg Cycle Length */}
            <div className="space-y-1.5">
              <label className="text-slate-350 text-xs font-semibold flex items-center space-x-1.5 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-rose-450" />
                <span>Avg Cycle Length (days)</span>
              </label>
              <input
                type="number"
                name="cycleLength"
                min="15"
                max="45"
                value={formData.cycleLength}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl text-slate-100 glass-input font-medium text-sm"
              />
              <p className="text-[10px] text-slate-500">Typical duration between periods. (Default 28)</p>
            </div>

            {/* Avg Period Duration */}
            <div className="space-y-1.5">
              <label className="text-slate-350 text-xs font-semibold flex items-center space-x-1.5 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-rose-450" />
                <span>Avg Period (days)</span>
              </label>
              <input
                type="number"
                name="periodLength"
                min="2"
                max="15"
                value={formData.periodLength}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl text-slate-100 glass-input font-medium text-sm"
              />
              <p className="text-[10px] text-slate-500">Number of bleeding days. (Default 5)</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all duration-300 btn-glow flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Navigation bottom */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-400 hover:text-rose-350 font-semibold transition-colors">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
