import React from 'react';
import { Calendar, Heart, TrendingUp, Sparkles } from 'lucide-react';

const StatCard = ({ predictions, periods, symptoms, user }) => {
  // Cycle math variables
  const cycleLength = predictions?.averageCycleLength ?? user?.averageCycleLength ?? 28;
  const loggedSymptoms = symptoms?.length ?? 0;
  const periodDuration = periods?.length > 0 
    ? Math.round(periods.reduce((acc, curr) => acc + (curr.duration || 0), 0) / periods.length) 
    : (user?.averagePeriodLength ?? 5);

  // Ovulation days remaining calculations
  const getOvulationCountdown = () => {
    if (!predictions?.ovulationDate) return 'No data';
    const diff = new Date(predictions.ovulationDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today!';
    if (days < 0) return 'Passed';
    return `In ${days} day${days > 1 ? 's' : ''}`;
  };

  const cards = [
    {
      id: 'cycle-len',
      label: 'Cycle Length',
      value: `${cycleLength} Days`,
      sub: 'Average over history',
      icon: <TrendingUp className="w-5 h-5 text-violet-500" />,
      bgColor: 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/10'
    },
    {
      id: 'symptom-count',
      label: 'Logged Symptoms',
      value: `${loggedSymptoms}`,
      sub: 'Total entries recorded',
      icon: <Heart className="w-5 h-5 text-purple-500" />,
      bgColor: 'bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/10'
    },
    {
      id: 'period-dur',
      label: 'Period Duration',
      value: `${periodDuration} Days`,
      sub: 'Average active bleeding',
      icon: <Calendar className="w-5 h-5 text-rose-500" />,
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/10'
    },
    {
      id: 'ovulation-countdown',
      label: 'Ovulation',
      value: getOvulationCountdown(),
      sub: predictions?.ovulationDate 
        ? new Date(predictions.ovulationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Predicting...',
      icon: <Sparkles className="w-5 h-5 text-teal-500" />,
      bgColor: 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div 
          key={card.id} 
          className="glass-panel p-5 rounded-2xl flex items-center justify-between border hover:border-violet-100 dark:hover:border-zinc-800 transition-all duration-300 group hover:-translate-y-0.5"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">{card.label}</span>
            <h3 className="font-outfit font-extrabold text-2xl text-slate-800 dark:text-white tracking-tight">{card.value}</h3>
            <span className="text-[10px] text-slate-400 dark:text-zinc-500 block leading-tight">{card.sub}</span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bgColor} border flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCard;
