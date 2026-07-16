import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, Calendar, Activity, User } from 'lucide-react';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <img src={logo} alt="FloNest Logo" className="w-9 h-9 group-hover:scale-105 transition-transform duration-300" />
          <span className="font-outfit font-bold text-xl md:text-2xl tracking-wide bg-gradient-to-r from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
            FloNest
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`font-medium flex items-center space-x-2 transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-rose-400' : 'text-slate-300 hover:text-rose-400'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/30 transition-all duration-300 font-medium text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <a href="#features" className="text-slate-300 hover:text-rose-400 font-medium transition-colors duration-200">
                Features
              </a>
              <Link to="/login" className="text-slate-300 hover:text-rose-400 font-medium transition-colors duration-200">
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all duration-300 btn-glow shadow-lg shadow-rose-600/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-300 hover:text-white focus:outline-none p-1.5 rounded-lg border border-white/10 bg-white/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-white/5 animate-fadeIn">
          <div className="flex flex-col space-y-4 px-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all ${
                    isActive('/dashboard') ? 'bg-rose-500/10 text-rose-400' : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 rounded-lg font-medium text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 font-medium transition-all"
                >
                  Features
                </a>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 font-medium transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="mx-3 text-center py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all duration-300 btn-glow shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
