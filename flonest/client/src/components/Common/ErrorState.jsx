import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="py-16 text-center max-w-md mx-auto space-y-5">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center mx-auto text-rose-500 animate-pulse">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-outfit font-bold text-slate-800 dark:text-white text-lg">Failed to Load Dashboard</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          {message || 'An error occurred while loading your health stats. Please verify your connection.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-violet-200 dark:border-zinc-800 hover:border-violet-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:bg-violet-50/50 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
