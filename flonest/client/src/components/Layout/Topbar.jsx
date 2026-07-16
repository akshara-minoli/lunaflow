import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import ThemeToggle from '../Common/ThemeToggle';
import NotificationDropdown from '../Common/NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick, predictions, periods, symptoms, setActiveTab, onLogout }) => {
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const clickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-100 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Welcome & Burger Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-slate-600 dark:text-zinc-400"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base leading-none">
            {getGreeting()}, {user?.name || 'User'} 👋
          </h2>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{todayStr}</span>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-2">
        {/* Search Input for Desktop */}
        <div className="hidden md:flex items-center relative mr-2">
          <Search className="w-4 h-4 text-slate-455 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search symptoms, dates..."
            className="w-48 xl:w-60 pl-9 pr-4 py-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 text-xs text-slate-700 dark:text-zinc-300 placeholder-slate-400 focus:outline-none focus:border-violet-300"
          />
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification Bell Dropdown */}
        <NotificationDropdown predictions={predictions} periods={periods} symptoms={symptoms} />

        {/* Profile Dropdown */}
        <div className="relative ml-2" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-violet-500 to-blush-500 border border-slate-200 dark:border-zinc-800 flex items-center justify-center text-white font-bold font-outfit text-sm transition-transform active:scale-95"
          >
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-4 h-4" />}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 glass-panel border border-violet-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-250">
              <div className="p-4 border-b border-violet-100 dark:border-zinc-800 bg-violet-50/20 dark:bg-zinc-900/20">
                <p className="font-semibold text-slate-800 dark:text-white text-xs truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="p-1.5 space-y-1">
                <button
                  onClick={() => { setActiveTab('profile'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-655 dark:text-zinc-300 hover:bg-violet-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-655 dark:text-zinc-300 hover:bg-violet-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => { onLogout(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
