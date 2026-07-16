import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children, activeTab, setActiveTab, predictions, periods, symptoms }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex transition-colors duration-300">
      {/* Sidebar Nav */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 lg:pl-64">
        {/* Topbar Nav */}
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          predictions={predictions}
          periods={periods}
          symptoms={symptoms}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Dynamic page content */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
