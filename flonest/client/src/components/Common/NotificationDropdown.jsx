import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, Droplet, Heart, CheckCircle2 } from 'lucide-react';

const NotificationDropdown = ({ predictions, periods, symptoms }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate dynamic notification items based on prediction/period data
  const getNotifications = () => {
    const items = [];

    if (predictions) {
      const days = predictions.daysRemaining;
      if (days !== null) {
        if (days === 0) {
          items.push({
            id: 'period-today',
            type: 'period',
            title: 'Period Predicted Today',
            message: 'Your predicted cycle start date is today. Stay prepared!',
            time: 'Just now',
            icon: <Droplet className="w-4 h-4 text-rose-500" />,
            bgColor: 'bg-rose-500/10 dark:bg-rose-500/20'
          });
        } else if (days > 0 && days <= 3) {
          items.push({
            id: 'period-near',
            type: 'period',
            title: 'Period Approaching',
            message: `Your next cycle is predicted to start in ${days} days.`,
            time: 'Today',
            icon: <Droplet className="w-4 h-4 text-rose-400" />,
            bgColor: 'bg-rose-500/5 dark:bg-rose-500/15'
          });
        } else if (days < 0) {
          items.push({
            id: 'period-late',
            type: 'period',
            title: 'Cycle Status: Late',
            message: `Your period is predicted to be ${Math.abs(days)} days late.`,
            time: 'Attention needed',
            icon: <Droplet className="w-4 h-4 text-amber-500" />,
            bgColor: 'bg-amber-500/10 dark:bg-amber-500/20'
          });
        }
      }

      if (predictions.ovulationDate) {
        const today = new Date();
        const ovDate = new Date(predictions.ovulationDate);
        const diffTime = ovDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          items.push({
            id: 'ovulation-today',
            type: 'ovulation',
            title: 'Ovulation Day Today!',
            message: 'You are at peak fertility today. Track any symptoms.',
            time: '1h ago',
            icon: <Heart className="w-4 h-4 text-teal-500" />,
            bgColor: 'bg-teal-500/10 dark:bg-teal-500/20'
          });
        } else if (diffDays > 0 && diffDays <= 2) {
          items.push({
            id: 'ovulation-near',
            type: 'ovulation',
            title: 'Fertile Window Active',
            message: `Ovulation predicted in ${diffDays} days. Fertility is high.`,
            time: '2h ago',
            icon: <Heart className="w-4 h-4 text-teal-400" />,
            bgColor: 'bg-teal-500/5 dark:bg-teal-500/15'
          });
        }
      }
    }

    // Default welcoming notification if empty
    if (items.length === 0) {
      items.push({
        id: 'welcome',
        type: 'general',
        title: 'Welcome to FloNest',
        message: 'Your health assistant is up and tracking. Log logs regularly to train predictions!',
        time: 'Active',
        icon: <CheckCircle2 className="w-4 h-4 text-violet-500" />,
        bgColor: 'bg-violet-500/10 dark:bg-violet-500/20'
      });
    }

    return items;
  };

  const notifications = getNotifications();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl relative border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-violet-50 dark:hover:bg-zinc-800/80 text-slate-600 dark:text-slate-350 transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && notifications[0].id !== 'welcome' && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-955" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass-panel border border-violet-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-250">
          <div className="px-4 py-3 bg-violet-50/50 dark:bg-zinc-900/50 border-b border-violet-100 dark:border-zinc-800 flex justify-between items-center">
            <span className="font-outfit font-bold text-slate-800 dark:text-white text-sm">Notifications</span>
            <span className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-bold px-2 py-0.5 rounded-full">
              {notifications.length} Alert{notifications.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-violet-100 dark:divide-zinc-800/50">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 hover:bg-violet-50/20 dark:hover:bg-zinc-900/20 transition-colors flex gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.bgColor}`}>
                  {notif.icon}
                </div>
                <div className="space-y-0.5">
                  <h5 className="font-semibold text-slate-850 dark:text-zinc-200 text-xs">{notif.title}</h5>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{notif.message}</p>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block pt-1">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
