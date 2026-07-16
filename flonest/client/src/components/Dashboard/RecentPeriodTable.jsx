import React from 'react';
import { Calendar, Trash2, Edit3, Droplet, Info } from 'lucide-react';

const RecentPeriodTable = ({ periods, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!periods || periods.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-3xl border text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center mx-auto text-rose-500">
          <Info className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h4 className="font-outfit font-bold text-slate-800 dark:text-white text-base">No Period Logs</h4>
          <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
            You haven't logged any cycles yet. Use the quick actions or buttons above to start tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-outfit font-extrabold text-slate-800 dark:text-white text-base">Recent Cycles</h3>
          <span className="text-[10px] text-slate-400 dark:text-zinc-555 font-bold uppercase tracking-wider">Log History</span>
        </div>
        <span className="text-[10px] font-bold bg-violet-100 dark:bg-violet-900/30 text-violet-750 dark:text-violet-300 px-3 py-1 rounded-full border border-violet-200/20">
          {periods.length} Logs
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-zinc-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-455">
              <th className="pb-3 pl-4">Start Date</th>
              <th className="pb-3">End Date</th>
              <th className="pb-3">Duration</th>
              <th className="pb-3">Cycle Length</th>
              <th className="pb-3">Notes</th>
              <th className="pb-3 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/50 text-xs">
            {periods.map((period) => (
              <tr key={period._id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                <td className="py-4 pl-4 font-semibold text-slate-800 dark:text-zinc-200">
                  <span className="flex items-center gap-2">
                    <Droplet className="w-3.5 h-3.5 text-rose-500" />
                    {formatDate(period.startDate)}
                  </span>
                </td>
                <td className="py-4 text-slate-700 dark:text-zinc-300">
                  {period.endDate ? formatDate(period.endDate) : <span className="text-rose-500 font-bold animate-pulse">Ongoing</span>}
                </td>
                <td className="py-4 text-slate-750 dark:text-zinc-300 font-medium">
                  {period.duration ? `${period.duration} days` : '—'}
                </td>
                <td className="py-4">
                  {period.cycleLength ? (
                    <span className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-750 dark:text-violet-300 font-semibold border border-violet-555/10">
                      {period.cycleLength} days
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-zinc-555 font-semibold">First log</span>
                  )}
                </td>
                <td className="py-4 text-slate-400 dark:text-slate-500 italic max-w-xs truncate">
                  {period.notes ? `"${period.notes}"` : '—'}
                </td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => onEdit && onEdit(period)}
                      className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-violet-50 dark:hover:bg-zinc-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      aria-label="Edit period log"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(period._id)}
                      className="p-1.5 rounded-lg border border-slate-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-rose-50 dark:hover:bg-rose-955/20 text-slate-500 hover:text-rose-500 transition-colors"
                      aria-label="Delete period log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {periods.map((period) => (
          <div 
            key={period._id} 
            className="p-4 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/80 rounded-2xl space-y-3.5"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Start Date</span>
                <span className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-rose-500" />
                  {formatDate(period.startDate)}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onEdit && onEdit(period)}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-500 hover:text-slate-800"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete && onDelete(period._id)}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 text-slate-555 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2.5 border-t border-slate-100 dark:border-zinc-850/50 text-xs">
              <div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">End Date</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">
                  {period.endDate ? formatDate(period.endDate).split(',')[0] : <span className="text-rose-500 font-bold">Ongoing</span>}
                </span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Duration</span>
                <span className="font-medium text-slate-700 dark:text-zinc-300">
                  {period.duration ? `${period.duration} days` : '—'}
                </span>
              </div>
              <div>
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Cycle Length</span>
                <span className="font-semibold text-violet-700 dark:text-violet-400">
                  {period.cycleLength ? `${period.cycleLength}d` : '—'}
                </span>
              </div>
            </div>

            {period.notes && (
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-850/50">
                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Notes</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">"{period.notes}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPeriodTable;
