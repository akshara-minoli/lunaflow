import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-violet-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-violet-50 dark:hover:bg-zinc-800/80 text-slate-600 dark:text-slate-350 transition-all duration-200"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-500 animate-pulse" />
      ) : (
        <Moon className="w-5 h-5 text-violet-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
