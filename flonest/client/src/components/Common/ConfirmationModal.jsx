import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  if (!isOpen) return null;

  const btnColors = {
    danger: 'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500/20',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500/20',
    primary: 'bg-violet-600 hover:bg-violet-500 text-white focus:ring-violet-500/20'
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl relative space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="space-y-1">
            <h3 className="font-outfit font-bold text-slate-800 dark:text-white text-base">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-655 dark:text-zinc-300 font-semibold text-xs transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`w-1/2 py-2.5 rounded-xl font-semibold text-xs transition-all ${btnColors[type] || btnColors.danger}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
