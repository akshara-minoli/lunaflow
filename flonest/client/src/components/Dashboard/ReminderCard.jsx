import React, { useState, useEffect } from 'react';
import { Bell, Droplet, Sparkles, Heart, BellOff } from 'lucide-react';

const ReminderCard = () => {
  // Map simple string keys to lucide icons
  const getIcon = (type) => {
    switch (type) {
      case 'droplet':
        return <Droplet className="text-rose-500 w-4 h-4" />;
      case 'sparkles':
        return <Sparkles className="text-teal-500 w-4 h-4" />;
      case 'bell':
        return <Bell className="text-violet-500 w-4 h-4" />;
      case 'heart':
        return <Heart className="text-purple-500 w-4 h-4" />;
      default:
        return <Bell className="text-slate-500 w-4 h-4" />;
    }
  };

  // Reminders state local persistence without circular objects
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('flonest_reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(item => item.iconType)) {
          return parsed;
        }
      } catch (e) {
        // Fallback if parsing fails
      }
    }
    return [
      { id: 'period', label: 'Upcoming Period Alert', daysBefore: 2, enabled: true, iconType: 'droplet' },
      { id: 'ovulation', label: 'Fertile Window Alert', daysBefore: 1, enabled: true, iconType: 'sparkles' },
      { id: 'hydration', label: 'Daily Hydration Intake', detail: '8 glasses/day', enabled: false, iconType: 'bell' },
      { id: 'meds', label: 'Vitamin & Wellness Tracker', detail: 'Morning vitamins', enabled: true, iconType: 'heart' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('flonest_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id) => {
    setReminders(prev => prev.map(rem => {
      if (rem.id === id) {
        return { ...rem, enabled: !rem.enabled };
      }
      return rem;
    }));
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Reminders & Alerts</h3>
          <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">Configure Notifications</span>
        </div>
        <Bell className="w-5 h-5 text-violet-500 animate-swing" />
      </div>

      <div className="space-y-3">
        {reminders.map((rem) => (
          <div 
            key={rem.id} 
            className="flex items-center justify-between p-3.5 bg-slate-50/50 dark:bg-zinc-900/35 border border-slate-100 dark:border-zinc-800/80 rounded-2xl transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                {rem.enabled ? getIcon(rem.iconType) : <BellOff className="text-slate-400 w-4 h-4" />}
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-semibold block transition-colors ${rem.enabled ? 'text-slate-800 dark:text-zinc-200' : 'text-slate-400 dark:text-slate-500 line-through'}`}>
                  {rem.label}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-555 font-semibold">
                  {rem.daysBefore ? `${rem.daysBefore} days prior` : rem.detail || 'Status active'}
                </span>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => toggleReminder(rem.id)}
              className={`
                relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${rem.enabled ? 'bg-violet-600' : 'bg-slate-200 dark:bg-zinc-800'}
              `}
              role="switch"
              aria-checked={rem.enabled}
            >
              <span
                aria-hidden="true"
                className={`
                  pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${rem.enabled ? 'translate-x-4' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderCard;
