import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Calendar, Droplet, Heart, Bell } from 'lucide-react';

const FloatingActionButton = ({ onAddPeriod, onLogSymptoms, onViewCalendar, onSetReminder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef(null);

  // Close the action menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const actions = [
    {
      id: 'reminder',
      label: 'Set Reminder',
      icon: <Bell className="w-4 h-4 text-violet-500" />,
      onClick: () => { onSetReminder && onSetReminder(); setIsOpen(false); },
      bgColor: 'bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/30'
    },
    {
      id: 'calendar',
      label: 'View Calendar',
      icon: <Calendar className="w-4 h-4 text-teal-500" />,
      onClick: () => { onViewCalendar && onViewCalendar(); setIsOpen(false); },
      bgColor: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/30'
    },
    {
      id: 'symptoms',
      label: 'Log Symptoms',
      icon: <Heart className="w-4 h-4 text-purple-500" />,
      onClick: () => { onLogSymptoms && onLogSymptoms(); setIsOpen(false); },
      bgColor: 'bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30'
    },
    {
      id: 'period',
      label: 'Add Period',
      icon: <Droplet className="w-4 h-4 text-rose-500" />,
      onClick: () => { onAddPeriod && onAddPeriod(); setIsOpen(false); },
      bgColor: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/30'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3" ref={fabRef}>
      {/* Mini Options Menu */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-2 animate-in slide-in-from-bottom duration-250 fade-in-0">
          {actions.map((act, index) => (
            <div key={act.id} className="flex items-center gap-3 group">
              <span className="px-3 py-1.5 text-xs font-semibold text-slate-750 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {act.label}
              </span>
              <button
                onClick={act.onClick}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${act.bgColor}`}
                aria-label={act.label}
              >
                {act.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-3xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-xl shadow-violet-500/25 transition-transform hover:scale-105 active:scale-95 btn-glow"
        aria-label="Quick Actions"
      >
        {isOpen ? (
          <X className="w-6 h-6 animate-in spin-in duration-300" />
        ) : (
          <Plus className="w-6 h-6 animate-in" />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
