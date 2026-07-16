import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.svg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devToken, setDevToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevToken('');

    if (!email) {
      setError('Please provide your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        setSuccess('Password reset link generated successfully!');
        if (res.data.data?.resetToken) {
          setDevToken(res.data.data.resetToken);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-16 px-4 relative">
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-rose-500/10 blur-[100px] -z-10" />

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl">
        
        {/* Header navigation */}
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-450 hover:text-rose-400 transition-colors uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        {/* Branding title */}
        <div className="space-y-3 mb-8">
          <img src={logo} alt="FloNest Logo" className="w-10 h-10 hover:rotate-6 transition-transform duration-350" />
          <h2 className="font-outfit font-bold text-3xl text-white">Reset Password</h2>
          <p className="text-slate-400 text-sm">
            Enter your email and we'll help you configure a new password.
          </p>
        </div>

        {/* Display messages */}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm flex flex-col space-y-2">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-teal-400 mt-0.5" />
              <span>{success}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-8">
              In a production system, this email will trigger SMTP transport. Check the server terminal logs to find the link.
            </p>
          </div>
        )}

        {/* Development Helper Action Panel */}
        {devToken && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Dev Mode Helper:
            </p>
            <p className="text-xs text-slate-300">
              A recovery token was returned in the development response. Click below to reset:
            </p>
            <Link
              to={`/reset-password/${devToken}`}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-350 transition-all duration-200"
            >
              <span>Go to Password Reset page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="jane@example.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-100 placeholder-slate-500 glass-input font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-all duration-300 btn-glow flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span>Request Recovery Link</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ForgotPassword;
