import React, { useState } from 'react';
import { Sparkles, Activity, AlertCircle, ArrowUpRight, ArrowDownRight, Minus, Edit3, Trash2, Info, Droplet, ChevronDown, ChevronUp } from 'lucide-react';

const SYMPTOMS_LIST = [
  { key: 'cramps',     label: 'Cramps',      color: 'text-rose-500',    bgColor: 'bg-rose-500/10' },
  { key: 'moodSwings', label: 'Mood Swings', color: 'text-violet-500',  bgColor: 'bg-violet-500/10' },
  { key: 'fatigue',   label: 'Fatigue',      color: 'text-amber-500',   bgColor: 'bg-amber-500/10' },
  { key: 'headache',  label: 'Headache',     color: 'text-indigo-500',  bgColor: 'bg-indigo-500/10' },
  { key: 'acne',      label: 'Acne',         color: 'text-teal-500',    bgColor: 'bg-teal-500/10' },
  { key: 'bloating',  label: 'Bloating',     color: 'text-purple-500',  bgColor: 'bg-purple-500/10' },
  { key: 'backPain',  label: 'Back Pain',    color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { key: 'nausea',    label: 'Nausea',       color: 'text-pink-500',    bgColor: 'bg-pink-500/10' },
];

const FLOW_COLORS = {
  none:   'text-slate-400',
  light:  'text-rose-300',
  medium: 'text-rose-500',
  heavy:  'text-rose-700',
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* ── Symptom Summary ─────────────────────────────────────────── */
const SymptomSummary = ({ symptoms = [], onEdit, onDelete }) => {
  const [view, setView] = useState('stats'); // 'stats' | 'logs'

  /* ── Stats helpers ── */
  const getStats = (key) => {
    const logs = symptoms.filter(s => s[key] === true);
    const count = logs.length;
    let lastOccur = 'Never';
    if (count > 0) {
      const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
      lastOccur = formatDate(sorted[0].date);
    }
    let trend = 'flat';
    if (symptoms.length > 2) {
      const half = Math.ceil(symptoms.length / 2);
      const recent = symptoms.slice(0, half).filter(s => s[key]).length;
      const older  = symptoms.slice(half).filter(s => s[key]).length;
      if (recent > older) trend = 'up';
      if (recent < older) trend = 'down';
    }
    return { count, lastOccur, trend };
  };

  /* ── Empty state ── */
  if (symptoms.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl border text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto text-teal-500">
          <Info className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="font-outfit font-bold text-slate-800 dark:text-white text-base">No Symptom Logs</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
            You haven't logged any symptoms yet. Use the button above to start recording daily wellbeing entries.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-5">
      {/* Header + toggle */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Symptom Tracker</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {symptoms.length} log{symptoms.length !== 1 ? 's' : ''} recorded
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('stats')}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
              view === 'stats'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-700'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setView('logs')}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-all ${
              view === 'logs'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-700'
            }`}
          >
            Log History
          </button>
        </div>
      </div>

      {/* ── STATS VIEW ── */}
      {view === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYMPTOMS_LIST.map((item) => {
            const stats = getStats(item.key);
            return (
              <div
                key={item.key}
                className="bg-white/40 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/80 p-4 rounded-2xl flex flex-col justify-between hover:border-violet-100 dark:hover:border-zinc-700 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{item.label}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-outfit font-extrabold text-xl text-slate-800 dark:text-white">{stats.count}d</span>
                      <span className="text-[10px] text-slate-400 font-semibold">tracked</span>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.bgColor} ${item.color}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-zinc-800/50 text-[10px]">
                  <div className="text-slate-400 font-semibold">
                    Last: <span className="text-slate-600 dark:text-zinc-400 font-bold">{stats.lastOccur}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {stats.trend === 'up'   && <span className="flex items-center text-rose-500 font-bold"><ArrowUpRight className="w-3.5 h-3.5" />High</span>}
                    {stats.trend === 'down' && <span className="flex items-center text-teal-500 font-bold"><ArrowDownRight className="w-3.5 h-3.5" />Low</span>}
                    {stats.trend === 'flat' && <span className="flex items-center text-slate-400 font-bold"><Minus className="w-3 h-3" />Steady</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LOG HISTORY VIEW ── */}
      {view === 'logs' && (
        <div className="space-y-3">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-zinc-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pl-3">Date</th>
                  <th className="pb-3">Flow</th>
                  <th className="pb-3">Pain</th>
                  <th className="pb-3">Symptoms</th>
                  <th className="pb-3">Notes</th>
                  <th className="pb-3 pr-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-xs">
                {symptoms.map((s) => {
                  const activeSymptoms = SYMPTOMS_LIST.filter(item => s[item.key]).map(item => item.label);
                  return (
                    <tr key={s._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                      <td className="py-3.5 pl-3 font-semibold text-slate-800 dark:text-zinc-200 whitespace-nowrap">
                        {formatDate(s.date)}
                      </td>
                      <td className="py-3.5">
                        <span className={`font-bold capitalize ${FLOW_COLORS[s.flow] || 'text-slate-400'}`}>
                          <Droplet className="inline w-3 h-3 mr-0.5" />{s.flow}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                          {s.painLevel}/10
                        </span>
                      </td>
                      <td className="py-3.5 max-w-[220px]">
                        {activeSymptoms.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {activeSymptoms.map(sym => (
                              <span key={sym} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-200/30">
                                {sym}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-600 italic text-[10px]">None reported</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400 dark:text-slate-500 italic max-w-[140px] truncate">
                        {s.notes ? `"${s.notes}"` : '—'}
                      </td>
                      <td className="py-3.5 pr-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => onEdit && onEdit(s)}
                            className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-violet-50 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                            aria-label="Edit symptom log"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete && onDelete(s._id)}
                            className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors"
                            aria-label="Delete symptom log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden space-y-3">
            {symptoms.map((s) => {
              const activeSymptoms = SYMPTOMS_LIST.filter(item => s[item.key]).map(item => item.label);
              return (
                <div key={s._id} className="p-4 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/80 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                      <p className="font-bold text-slate-800 dark:text-white text-xs">{formatDate(s.date)}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onEdit && onEdit(s)}
                        className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-400 hover:text-violet-600"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(s._id)}
                        className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-100 dark:border-zinc-800/50 text-xs">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Flow</span>
                      <span className={`font-bold capitalize ${FLOW_COLORS[s.flow]}`}>
                        <Droplet className="inline w-3 h-3 mr-0.5" />{s.flow}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pain Level</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{s.painLevel}/10</span>
                    </div>
                  </div>

                  {activeSymptoms.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/50">
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Symptoms</span>
                      <div className="flex flex-wrap gap-1">
                        {activeSymptoms.map(sym => (
                          <span key={sym} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-200/30">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {s.notes && (
                    <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/50">
                      <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Notes</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">"{s.notes}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomSummary;
