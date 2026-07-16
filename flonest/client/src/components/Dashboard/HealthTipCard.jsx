import React from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

const HealthTipCard = () => {
  const tips = [
    { title: 'Stay Hydrated', text: 'Hydration supports hormone metabolism and reduces cycle cramps. Aim for 8-10 glasses today.', icon: '💧' },
    { title: 'Iron Intake', text: 'Loss of blood drains iron reserves. Fuel your system with spinach, beans, or lean meats.', icon: '🥗' },
    { title: 'Gentle Workouts', text: 'Try low-impact yoga or walking to release endorphins, which naturally soothe cramps.', icon: '🧘' },
    { title: 'Prioritize Quality Sleep', text: 'Progesterone levels can impact sleep depth. Rest in a dark, cool room with zero screen time.', icon: '😴' },
    { title: 'Regular Tracking', text: 'Logging daily logs calibrates predictions. Even logging "no symptoms" is incredibly helpful data.', icon: '🌸' }
  ];

  // Rotate based on the current day of month
  const todayDay = new Date().getDate();
  const activeTip = tips[todayDay % tips.length];

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-4 relative overflow-hidden bg-gradient-to-tr from-teal-500/5 via-transparent to-transparent">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center flex-shrink-0 text-lg">
          {activeTip.icon}
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">Health Tip of the Day</span>
          <h4 className="font-outfit font-extrabold text-slate-800 dark:text-white text-sm leading-none">{activeTip.title}</h4>
        </div>
      </div>

      <p className="text-slate-555 dark:text-zinc-350 text-xs leading-relaxed">
        {activeTip.text}
      </p>

      <div className="flex items-center gap-1 text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
        <Lightbulb className="w-3.5 h-3.5" />
        <span>Wellness Insight</span>
      </div>
    </div>
  );
};

export default HealthTipCard;
