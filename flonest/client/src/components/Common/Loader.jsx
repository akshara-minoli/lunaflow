import React from 'react';

export const CardSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-24"></div>
      <div className="w-8 h-8 bg-violet-200/30 dark:bg-zinc-800/80 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-1/2"></div>
      <div className="h-3 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-3/4"></div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-6">
    <div className="h-5 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-1/3"></div>
    <div className="h-64 bg-violet-200/20 dark:bg-zinc-800/50 rounded-xl flex items-end p-4 justify-around gap-2">
      <div className="h-1/3 bg-violet-200/30 dark:bg-zinc-800/70 rounded w-8"></div>
      <div className="h-2/3 bg-violet-200/30 dark:bg-zinc-800/70 rounded w-8"></div>
      <div className="h-1/2 bg-violet-200/30 dark:bg-zinc-800/70 rounded w-8"></div>
      <div className="h-3/4 bg-violet-200/30 dark:bg-zinc-800/70 rounded w-8"></div>
      <div className="h-2/5 bg-violet-200/30 dark:bg-zinc-800/70 rounded w-8"></div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Welcome Ske */}
    <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2.5 w-1/3">
        <div className="h-8 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-3/4"></div>
        <div className="h-4 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-1/2"></div>
      </div>
      <div className="h-8 bg-violet-200/30 dark:bg-zinc-800/80 rounded-full w-28"></div>
    </div>

    {/* Stats Ske */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>

    {/* Main sections */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ChartSkeleton />
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <div className="h-5 bg-violet-200/30 dark:bg-zinc-800/80 rounded w-1/4"></div>
          <div className="h-40 bg-violet-200/20 dark:bg-zinc-800/50 rounded-xl"></div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="glass-panel p-6 rounded-2xl h-80"></div>
        <div className="glass-panel p-6 rounded-2xl h-64"></div>
      </div>
    </div>
  </div>
);

const Loader = ({ type = 'page' }) => {
  if (type === 'dashboard') {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-grow flex items-center justify-center min-h-[400px]">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
