import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Lightbulb, TrendingUp, RefreshCw } from 'lucide-react';

const InsightCard = ({ periods, symptoms, predictions }) => {
  const [insightIndex, setInsightIndex] = useState(0);

  // Generate dynamic, friendly, clinical health insights based on logs
  const getInsights = () => {
    const list = [];
    const cycleLen = predictions?.averageCycleLength || 28;
    const periodDur = periods?.length > 0 
      ? Math.round(periods.reduce((acc, curr) => acc + (curr.duration || 0), 0) / periods.length) 
      : 5;

    // 1. Core stats insight
    list.push({
      id: 'core-stats',
      title: 'Cycle Averages',
      text: `Your average cycle length is ${cycleLen} days, with bleeding lasting around ${periodDur} days. This sits perfectly within typical wellness bounds!`,
      icon: <TrendingUp className="w-5 h-5 text-violet-500" />
    });

    // 2. Consistency insight
    if (periods.length > 2) {
      const cycleLengths = periods.filter(p => p.cycleLength > 0).map(p => p.cycleLength);
      const isRegular = cycleLengths.every(len => Math.abs(len - cycleLen) <= 3);
      if (isRegular) {
        list.push({
          id: 'consistency',
          title: 'High Cycle Consistency',
          text: 'Your cycle lengths have been remarkably regular over the past few logs. This regularity is a strong indicator of hormone balance and overall wellness.',
          icon: <Sparkles className="w-5 h-5 text-teal-500" />
        });
      } else {
        list.push({
          id: 'consistency-var',
          title: 'Cycle Variance Observed',
          text: 'We noticed some variation in your cycle lengths. Sleep quality, hydration, stress levels, and travel can naturally shift cycle timelines.',
          icon: <Lightbulb className="w-5 h-5 text-amber-500" />
        });
      }
    }

    // 3. Symptom patterns
    if (symptoms.length > 0) {
      const totalSymptomDays = symptoms.length;
      const fatigueDays = symptoms.filter(s => s.fatigue).length;
      const crampsDays = symptoms.filter(s => s.cramps).length;

      if (crampsDays > 0) {
        const pct = Math.round((crampsDays / totalSymptomDays) * 100);
        list.push({
          id: 'symptom-cramps',
          title: 'Cramping Logs',
          text: `You tracked cramps during ${pct}% of your logged wellness days. Using a warm compress and light stretching can assist in smoothing cramps.`,
          icon: <Lightbulb className="w-5 h-5 text-rose-500" />
        });
      }

      if (fatigueDays > 0) {
        const pct = Math.round((fatigueDays / totalSymptomDays) * 100);
        list.push({
          id: 'symptom-fatigue',
          title: 'Energy Tracker Insights',
          text: `Fatigue was present in ${pct}% of your tracked days. Consider adding magnesium-rich foods or prioritizing 8+ hours of sleep during this phase.`,
          icon: <Sparkles className="w-5 h-5 text-indigo-500" />
        });
      }
    }

    // Default insight fallback
    if (list.length < 3) {
      list.push({
        id: 'fallback-learn',
        title: 'Calibrating Predictions',
        text: 'FloNest learns from your logs! Keep recording periods and tracking symptoms daily to unlock personalized hormones & phase insights.',
        icon: <Lightbulb className="w-5 h-5 text-violet-500" />
      });
    }

    return list;
  };

  const insights = getInsights();

  // Rotator effect
  const handleNext = () => {
    setInsightIndex(prev => (prev + 1) % insights.length);
  };

  const current = insights[insightIndex];

  if (!current) return null;

  return (
    <div className="glass-panel p-6 rounded-3xl border flex flex-col justify-between h-[180px] shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            {current.icon}
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">FloNest Advisory</span>
            <h4 className="font-outfit font-extrabold text-slate-800 dark:text-white text-sm leading-none">{current.title}</h4>
          </div>
        </div>
        <button 
          onClick={handleNext}
          className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 hover:bg-violet-50 dark:hover:bg-zinc-800 text-slate-500 transition-colors"
          aria-label="Next advisory insight"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-slate-555 dark:text-zinc-350 text-xs leading-relaxed pr-2">
        {current.text}
      </p>

      <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-555">
        <span>Cycle Intelligence Engine</span>
        <span>{insightIndex + 1} of {insights.length}</span>
      </div>
    </div>
  );
};

export default InsightCard;
