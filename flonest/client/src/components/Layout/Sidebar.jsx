import React from 'react';
import { 
  LayoutDashboard, Droplet, Heart, Calendar, 
  Sparkles, BarChart2, Bell, User, Settings, LogOut, X
} from 'lucide-react';
import logo from '../../assets/logo.svg';

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'periods', label: 'Period Tracker', icon: <Droplet className="w-5 h-5" /> },
    { id: 'symptoms', label: 'Symptom Tracker', icon: <Heart className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'fertility', label: 'Fertility & Ovulation', icon: <Sparkles className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Sidebar overlay background */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-45 bg-black/45 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 backdrop-blur-lg flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FloNest Logo" className="w-8 h-8 hover:rotate-6 transition-transform" />
            <span className="font-outfit font-black text-xl text-slate-800 dark:text-white tracking-tight">FloNest</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-violet-50 dark:hover:bg-zinc-800 text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Items list */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/15' 
                    : 'text-slate-500 hover:text-slate-850 dark:hover:text-white hover:bg-violet-50/50 dark:hover:bg-zinc-800/40'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout action */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800">
          <button
            onClick={() => {
              onLogout && onLogout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955/20 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
