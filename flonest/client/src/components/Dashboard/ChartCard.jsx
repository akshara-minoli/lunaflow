import React, { useState } from 'react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { BarChart3, LineChart as LineIcon, Activity, Sparkles } from 'lucide-react';

const ChartCard = ({ periods, symptoms }) => {
  const [activeChart, setActiveChart] = useState('cycleLength');

  // Format date helper
  const fmtDate = (dStr) => {
    if (!dStr) return '';
    return new Date(dStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // 1. Data formulation: Cycle lengths
  const getCycleData = () => {
    return periods
      .slice()
      .reverse() // show oldest to newest
      .filter(p => p.cycleLength > 0)
      .map(p => ({
        date: fmtDate(p.startDate),
        'Cycle Length': p.cycleLength,
        'Duration': p.duration || 5
      }));
  };

  // 2. Data formulation: Symptom frequencies
  const getSymptomData = () => {
    const list = [
      { name: 'Cramps', count: 0 },
      { name: 'Mood', count: 0 },
      { name: 'Fatigue', count: 0 },
      { name: 'Headache', count: 0 },
      { name: 'Acne', count: 0 },
      { name: 'Bloating', count: 0 },
      { name: 'Back Pain', count: 0 },
      { name: 'Nausea', count: 0 }
    ];

    symptoms.forEach(s => {
      if (s.cramps) list[0].count++;
      if (s.moodSwings) list[1].count++;
      if (s.fatigue) list[2].count++;
      if (s.headache) list[3].count++;
      if (s.acne) list[4].count++;
      if (s.bloating) list[5].count++;
      if (s.backPain) list[6].count++;
      if (s.nausea) list[7].count++;
    });

    return list;
  };

  // 3. Data formulation: Pain Level Trend
  const getPainData = () => {
    return symptoms
      .slice()
      .reverse()
      .slice(-10) // last 10 logs
      .map(s => ({
        date: fmtDate(s.date),
        'Pain Level': s.painLevel || 0
      }));
  };

  const cycleData = getCycleData();
  const symptomData = getSymptomData();
  const painData = getPainData();

  const renderChart = () => {
    if (activeChart === 'cycleLength') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={cycleData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.05)" />
            <XAxis dataKey="date" tick={{ fill: '#8b8b9a', fontSize: 10 }} stroke="rgba(139, 92, 246, 0.1)" />
            <YAxis tick={{ fill: '#8b8b9a', fontSize: 10 }} stroke="rgba(139, 92, 246, 0.1)" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,29,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
            <Line type="monotone" dataKey="Cycle Length" stroke="#8B5CF6" strokeWidth={3} activeDot={{ r: 6 }} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Duration" stroke="#F9A8D4" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (activeChart === 'symptoms') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={symptomData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.05)" />
            <XAxis dataKey="name" tick={{ fill: '#8b8b9a', fontSize: 10 }} stroke="rgba(139, 92, 246, 0.1)" />
            <YAxis tick={{ fill: '#8b8b9a', fontSize: 10 }} stroke="rgba(139, 92, 246, 0.1)" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,29,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
            <Bar dataKey="count" name="Frequency (Days)" fill="#14B8A6" radius={[6, 6, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    // Pain level chart
    return (
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={painData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F9A8D4" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#F9A8D4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.05)" />
          <XAxis dataKey="date" tick={{ fill: '#8b8b9a', fontSize: 10 }} stroke="rgba(139, 92, 246, 0.1)" />
          <YAxis tick={{ fill: '#8b8b9a', fontSize: 10 }} stroke="rgba(139, 92, 246, 0.1)" />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(20,20,29,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} />
          <Area type="monotone" dataKey="Pain Level" stroke="#F9A8D4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPain)" />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const chartTabs = [
    { id: 'cycleLength', label: 'Cycle Trends', icon: <LineIcon className="w-3.5 h-3.5" /> },
    { id: 'symptoms', label: 'Symptom Freq', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'pain', label: 'Pain Tracker', icon: <Activity className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Health Analytics</h3>
          <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">Metrics & Visualizations</span>
        </div>
        <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl gap-1">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${activeChart === tab.id 
                  ? 'bg-white dark:bg-zinc-800 text-violet-750 dark:text-white shadow-sm border border-violet-100 dark:border-zinc-700' 
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-zinc-350'}
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        {(activeChart === 'cycleLength' && cycleData.length === 0) || 
         (activeChart === 'symptoms' && symptomData.every(s => s.count === 0)) ||
         (activeChart === 'pain' && painData.length === 0) ? (
          <div className="h-64 flex flex-col justify-center items-center text-slate-400 dark:text-zinc-555 text-xs space-y-2">
            <Sparkles className="w-8 h-8 text-slate-350 animate-pulse" />
            <p className="font-medium">No analytics datasets generated yet.</p>
            <p className="text-[10px] text-slate-455">Log details to view historical graphs.</p>
          </div>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};

export default ChartCard;
