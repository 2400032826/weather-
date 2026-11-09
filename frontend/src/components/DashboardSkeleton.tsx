import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-4 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-2 w-full sm:w-1/2">
          <div className="h-6 w-48 bg-slate-700 rounded-md"></div>
          <div className="h-4 w-32 bg-slate-700/60 rounded-md"></div>
        </div>
        <div className="h-9 w-36 bg-emerald-700/40 rounded-xl"></div>
      </div>

      {/* Main Current Weather Card Skeleton */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="h-5 w-40 bg-emerald-500/20 rounded-full"></div>
            <div className="flex items-baseline gap-3">
              <div className="h-16 sm:h-20 w-36 sm:w-44 bg-slate-700/80 rounded-2xl"></div>
              <div className="h-8 w-24 bg-slate-700/50 rounded-xl"></div>
            </div>
            <div className="h-5 w-48 bg-slate-700/60 rounded-lg"></div>
          </div>
          <div className="h-24 w-24 sm:h-32 sm:w-32 bg-slate-700/40 rounded-full self-center"></div>
        </div>

        {/* 4 Metric Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/80 rounded-xl p-3 sm:p-4 border border-slate-700/40 space-y-2">
              <div className="h-3 w-16 bg-slate-700 rounded"></div>
              <div className="h-6 w-20 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Card Skeleton */}
      <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 sm:p-5 flex items-center gap-4">
        <div className="h-10 w-10 bg-emerald-500/20 rounded-xl shrink-0"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 w-56 bg-emerald-600/30 rounded"></div>
          <div className="h-4 w-full bg-emerald-700/20 rounded"></div>
        </div>
      </div>

      {/* Hourly Forecast Carousel Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-44 bg-slate-700 rounded"></div>
          <div className="h-4 w-20 bg-slate-700/60 rounded"></div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="min-w-[80px] sm:min-w-[90px] h-28 bg-slate-800/70 border border-slate-700/40 rounded-xl p-3 flex flex-col items-center justify-between"
            >
              <div className="h-3 w-10 bg-slate-700 rounded"></div>
              <div className="h-7 w-7 bg-slate-600 rounded-full"></div>
              <div className="h-4 w-12 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 10-Day Forecast Skeleton */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-3">
        <div className="h-5 w-48 bg-slate-700 rounded mb-4"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl">
            <div className="h-4 w-24 bg-slate-700 rounded"></div>
            <div className="h-6 w-6 bg-slate-600 rounded-full"></div>
            <div className="h-4 w-28 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
