import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-4 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-2 w-full sm:w-1/2">
          <div className="h-6 w-48 bg-slate-200 rounded-md"></div>
          <div className="h-4 w-32 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-36 bg-emerald-100 rounded-2xl"></div>
      </div>

      {/* Main Current Weather Card Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="h-5 w-36 bg-slate-200 rounded-full"></div>
          <div className="h-5 w-28 bg-emerald-100 rounded-full"></div>
        </div>

        {/* Summary Card Skeleton */}
        <div className="h-20 bg-emerald-50 rounded-2xl border border-emerald-100"></div>

        {/* Temp & Condition */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-16 w-36 bg-slate-200 rounded-2xl"></div>
            <div className="h-4 w-28 bg-slate-100 rounded-lg"></div>
          </div>
          <div className="h-12 w-32 bg-slate-100 rounded-2xl"></div>
        </div>

        {/* 4 Metric Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
              <div className="h-7 w-20 bg-slate-300 rounded"></div>
              <div className="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Card Skeleton */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-5 flex items-center gap-4 shadow-xs">
        <div className="h-12 w-12 bg-emerald-200 rounded-2xl shrink-0"></div>
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-emerald-300 rounded"></div>
          <div className="h-4 w-full bg-emerald-200/80 rounded"></div>
        </div>
      </div>

      {/* Hourly Forecast Carousel Skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="h-5 w-44 bg-slate-200 rounded"></div>
          <div className="h-8 w-28 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="min-w-[110px] h-36 bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5 flex flex-col items-center justify-between"
            >
              <div className="h-3 w-12 bg-slate-200 rounded"></div>
              <div className="h-7 w-7 bg-slate-300 rounded-full"></div>
              <div className="h-5 w-14 bg-slate-200 rounded"></div>
              <div className="h-3 w-16 bg-slate-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
