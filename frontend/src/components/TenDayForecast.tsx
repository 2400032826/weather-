import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  Sun,
  ChevronDown,
  ChevronUp,
  Droplets,
} from 'lucide-react';
import type { Language } from '../lib/translations';
import { translations } from '../lib/translations';
import type { DailyForecastItem } from '../lib/weatherService';

interface TenDayForecastProps {
  days: DailyForecastItem[];
  currentLang: Language;
}

export const TenDayForecast: React.FC<TenDayForecastProps> = ({ days, currentLang }) => {
  const t = translations[currentLang];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const formatDayName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      if (d.toDateString() === today.toDateString()) {
        return currentLang === 'te' ? 'ఈ రోజు' : currentLang === 'kn' ? 'ಇಂದು' : 'Today';
      }
      return d.toLocaleDateString(currentLang === 'te' ? 'te-IN' : currentLang === 'kn' ? 'kn-IN' : 'en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const toggleDay = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  if (!days || days.length === 0) return null;

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="font-extrabold text-slate-800 text-base sm:text-lg">
              {t.tenDayTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.tenDaySubtitle}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {t.tapForDetails}
        </span>
      </div>

      {/* 10-Day Cards List */}
      <div className="space-y-2">
        {days.map((day, idx) => {
          const isRain = day.precipitationMm >= 0.1 || day.precipitationProbability >= 40;
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition overflow-hidden ${
                isRain ? 'border-orange-200 bg-orange-50/40' : 'border-slate-200 bg-slate-50/60'
              } hover:border-emerald-300`}
            >
              <div
                onClick={() => toggleDay(idx)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* Day & Date */}
                <div className="flex items-center gap-3 min-w-[120px]">
                  <div className={`p-2 rounded-xl ${isRain ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-amber-500'}`}>
                    {isRain ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {formatDayName(day.date)}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {day.conditionText}
                    </p>
                  </div>
                </div>

                {/* Rain probability & Expected mm */}
                <div className="text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className={`w-3.5 h-3.5 ${isRain ? 'text-orange-500' : 'text-slate-400'}`} />
                    <span className={`text-xs font-bold ${isRain ? 'text-orange-700' : 'text-slate-600'}`}>
                      {day.precipitationProbability}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {day.precipitationMm > 0 ? `${day.precipitationMm.toFixed(1)} mm` : '0 mm'}
                  </span>
                </div>

                {/* Temperature (Max / Min) */}
                <div className="flex items-center gap-2 font-mono text-sm">
                  <span className="font-black text-slate-900">
                    {Math.round(day.temperatureMaxC)}°
                  </span>
                  <span className="text-slate-400">/</span>
                  <span className="font-semibold text-slate-500">
                    {Math.round(day.temperatureMinC)}°
                  </span>
                </div>

                {/* Expand / Collapse Icon */}
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-slate-200/60 bg-white/70 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold block">{t.maxTemp}</span>
                    <strong className="text-slate-800 text-sm">{Math.round(day.temperatureMaxC)}°C</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold block">{t.minTemp}</span>
                    <strong className="text-slate-800 text-sm">{Math.round(day.temperatureMinC)}°C</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold block">{t.expectedRain}</span>
                    <strong className="text-slate-800 text-sm">{day.precipitationMm.toFixed(1)} mm</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 font-bold block">{t.rainChance}</span>
                    <strong className="text-emerald-700 text-sm">{day.precipitationProbability}%</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
