import React from 'react';
import { Plus } from 'lucide-react';

const EmptyState = ({ title, message, actionText, onAction, iconType = 'period' }) => {
  // Inline SVG illustrations for a highly premium customized feel
  const renderIllustration = () => {
    if (iconType === 'period') {
      return (
        <svg className="w-28 h-28 mx-auto text-rose-350 dark:text-rose-400/80 animate-bounce" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 15C50 15 25 45 25 65C25 78.8071 36.1929 90 50 90C63.8071 90 75 78.8071 75 65C75 45 50 15 50 15Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M50 45V70M37.5 57.5H62.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg className="w-28 h-28 mx-auto text-teal-400 dark:text-teal-500/80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="20" width="50" height="60" rx="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <path d="M35 35H65M35 50H65M35 65H55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.3" className="animate-ping" />
      </svg>
    );
  };

  return (
    <div className="py-16 text-center max-w-md mx-auto space-y-5">
      <div className="flex justify-center">
        {renderIllustration()}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-outfit font-bold text-slate-800 dark:text-white text-lg">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
      </div>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 btn-glow"
        >
          <Plus className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
