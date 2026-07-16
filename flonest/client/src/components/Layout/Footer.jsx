import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-darkbg-900/80 mt-auto py-12 px-6 md:px-12 backdrop-blur-md">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Branding */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="FloNest Logo" className="w-8 h-8" />
            <span className="font-outfit font-bold text-lg tracking-wide text-white">
              FloNest
            </span>
          </div>
          <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
            Track your menstrual cycle with confidence. Log symptoms, track mood changes, and receive smart, personalized insights.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <a href="#features" className="hover:text-rose-400 transition-colors">Features</a>
            </li>
            <li>
              <Link to="/login" className="hover:text-rose-400 transition-colors">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-rose-400 transition-colors">Register</Link>
            </li>
          </ul>
        </div>

        {/* Legal info */}
        <div>
          <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-rose-400 cursor-pointer transition-colors">Privacy Policy</li>
            <li className="hover:text-rose-400 cursor-pointer transition-colors">Terms of Service</li>
            <li className="hover:text-rose-400 cursor-pointer transition-colors">Data Security</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} FloNest. All rights reserved.</p>
        <p className="mt-2 md:mt-0 flex items-center space-x-1">
          <span>Made with</span>
          <span className="text-rose-500 text-sm">♥</span>
          <span>for better health.</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
