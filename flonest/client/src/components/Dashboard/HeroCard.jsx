import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

const HeroCard = ({ predictions, user }) => {
  const daysRemaining = predictions?.daysRemaining ?? null;
  const currentPhase = predictions?.status || 'Unknown Phase';
  const averageCycleLength = predictions?.averageCycleLength ?? user?.averageCycleLength ?? 28;
  const currentDay = predictions?.currentCycleDay ?? 1;

  // Percentage for progress ring
  const percentage = Math.min(100, Math.max(0, (currentDay / averageCycleLength) * 100));

  // Determine soft theme colors for cycle phase
  const getPhaseTheme = (phase) => {
    const ph = phase.toLowerCase();
    if (ph.includes('menstru') || ph.includes('period')) {
      return {
        label: 'Menstrual Phase',
        desc: 'Focus on rest, hydration, and gentle stretching.',
        gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
        accent: 'text-rose-500',
        ringColor: 'stroke-rose-500'
      };
    }
    if (ph.includes('ovulat') || ph.includes('fertil')) {
      return {
        label: 'Ovulatory Phase',
        desc: 'High energy! Perfect for intense workouts and socializing.',
        gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
        accent: 'text-teal-500',
        ringColor: 'stroke-teal-500'
      };
    }
    if (ph.includes('luteal') || ph.includes('pms')) {
      return {
        label: 'Luteal Phase',
        desc: 'Practice nesting, self-care, and eat nourishing foods.',
        gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
        accent: 'text-violet-500',
        ringColor: 'stroke-violet-500'
      };
    }
    // Default follicular
    return {
      label: 'Follicular Phase',
      desc: 'Energy is building! A great time to start new projects.',
      gradient: 'from-indigo-500/20 via-sky-500/10 to-transparent',
      accent: 'text-indigo-500',
      ringColor: 'stroke-indigo-500'
    };
  };

  const phaseMeta = getPhaseTheme(currentPhase);
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  return (
    <div className={`relative overflow-hidden glass-panel p-6 md:p-8 rounded-3xl bg-gradient-to-br ${phaseMeta.gradient} flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl`}>
      {/* Dynamic Background Blur Balls */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-violet-400/10 dark:bg-violet-500/5 blur-[50px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blush-400/10 dark:bg-pink-500/5 blur-[50px] pointer-events-none" />

      {/* Hero Stats */}
      <div className="space-y-4 flex-grow text-center md:text-left z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Your Cycle at a Glance</span>
          <h1 className="font-outfit font-extrabold text-3xl md:text-4xl text-slate-800 dark:text-white">
            Day {currentDay}
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-400 font-semibold">
            of your {averageCycleLength}-day cycle
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className={`w-4 h-4 ${phaseMeta.accent}`} />
            <span className={`font-bold text-sm ${phaseMeta.accent}`}>{phaseMeta.label}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:max-w-md leading-relaxed">
            {phaseMeta.desc}
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
          <div className="bg-white/60 dark:bg-zinc-900/60 border border-violet-100/50 dark:border-zinc-800/80 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-violet-500 flex-shrink-0" />
            <div className="text-left">
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Next Period</span>
              <span className="font-outfit font-bold text-sm text-slate-800 dark:text-white">
                {daysRemaining === null ? 'No logs yet' :
                 daysRemaining === 0 ? 'Due Today' :
                 daysRemaining > 0 ? `${daysRemaining} Days` :
                 `${Math.abs(daysRemaining)} Days Late`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Progress Ring */}
      <div className="relative flex-shrink-0 flex items-center justify-center z-10 w-36 h-36">
        <svg className="w-full h-full transform -rotate-90">
          {/* Track */}
          <circle
            cx="72"
            cy="72"
            r="40"
            className="stroke-slate-100 dark:stroke-zinc-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress */}
          <circle
            cx="72"
            cy="72"
            r="40"
            className={`transition-all duration-500 ease-out ${phaseMeta.ringColor}`}
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-outfit font-black text-2xl text-slate-800 dark:text-white leading-none">
            {Math.round(percentage)}%
          </span>
          <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
            complete
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
