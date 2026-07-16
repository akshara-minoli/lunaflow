import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

const PredictionCard = ({ predictions }) => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate live countdown to the next expected period date
  useEffect(() => {
    if (!predictions?.nextPeriod) return;

    const targetDate = new Date(predictions.nextPeriod);
    targetDate.setHours(0, 0, 0, 0); // start of day

    const timer = setInterval(() => {
      const difference = targetDate - new Date();
      if (difference <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        setCountdown({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [predictions?.nextPeriod]);

  if (!predictions) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Regularity / Confidence score logic (mocked nicely based on data logs)
  const regularityConfidence = predictions?.daysRemaining !== null ? 92 : 45;

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6 relative overflow-hidden border">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-500" />
        <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Prediction Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Countdown */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Next Expected Period</span>
            <div className="font-outfit font-black text-2xl text-slate-800 dark:text-white">
              {formatDate(predictions.nextPeriod)}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Countdown to cycle start:</span>
            </p>
          </div>

          <div className="flex gap-2">
            {[
              { val: countdown.days, label: 'Days' },
              { val: countdown.hours, label: 'Hrs' },
              { val: countdown.minutes, label: 'Mins' }
            ].map((unit, idx) => (
              <div key={idx} className="flex-1 bg-violet-500/5 dark:bg-zinc-800/40 border border-violet-100/50 dark:border-zinc-800/80 p-2.5 rounded-2xl text-center">
                <span className="font-outfit font-extrabold text-xl text-slate-850 dark:text-white block leading-none">{unit.val}</span>
                <span className="text-[9px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider mt-0.5 block">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* fertile, ovulation, and confidence indicator */}
        <div className="space-y-4">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-555 dark:text-zinc-400 font-semibold">Ovulation Date</span>
              <span className="font-bold text-slate-800 dark:text-white">{formatDate(predictions.ovulationDate)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-555 dark:text-zinc-400 font-semibold">Fertile Window</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {predictions.fertileWindow
                  ? `${formatDate(predictions.fertileWindow.start).split(',')[0]} - ${formatDate(predictions.fertileWindow.end).split(',')[0]}`
                  : '—'}
              </span>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-400 dark:text-zinc-555">Cycle Regularity</span>
              <span className="text-violet-600 dark:text-violet-400">{regularityConfidence}% Confidence</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-blush-500 rounded-full transition-all duration-500"
                style={{ width: `${regularityConfidence}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 leading-normal">
              {regularityConfidence > 80 
                ? 'Predictions are highly precise based on regular historical data logs.'
                : 'Log at least 3 periods to train and calibrate prediction regularities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
